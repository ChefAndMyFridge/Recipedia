# app/services/recipe_summary.py
import time
import asyncio
import copy

from youtubesearchpython import Transcript, Video
from app.services.LLM.recipe_generator import RequestGPT
from fastapi import HTTPException
from app.utils.prompts.few_shot import SUMMARY_FEW_SHOT_DATA
from app.utils.prompts.recipe_summary_prompts import SUMMARY_SYSTEM_INPUT, SUMMARY_USER_INPUT, SUMMARY_DESCRIPTION_INPUT
from app.core.config import settings
from app.core.logging_config import logger
from googleapiclient.discovery import build
from app.utils.youtube_change_key import rotate_youtube_api_key


class RecipeSummary:
    def __init__(self):
        self.api_key: str = settings.OPENAI_API_KEY
        if not self.api_key:
            logger.error(
                f"{settings.LOG_SUMMARY_PREFIX}_OPENAI_API_KEY가 설정되지 않았습니다.")
            raise HTTPException(
                status_code=500, detail="OPENAI_API_KEY가 설정되지 않았습니다.")
        # OpenAI 클라이언트 (비동기) 생성 – YoutubeQuery와 유사하게 생성자에서 한 번만 초기화
        self.request_gpt = RequestGPT(self.api_key)

        # 자막 언어 우선순위
        self.priority_lang = ["Korean, English"]

        # 디버그 모드
        self.debug_mode = settings.DEBUG

    def fetch_and_format_transcript(self, video_id: str, lang):
        transcript = Transcript.get(video_id, lang['params'])
        scripts = " ".join([f"[{(int(item['startMs']) // 1000)}]" + item["text"].replace(
            "\n", "").replace("\r", "") for item in transcript["segments"]])
        if len(scripts) > settings.YOUTUBE_TRANSCRIPT_LEN_TH:
            logger.info(
                f"{settings.LOG_SUMMARY_PREFIX}_자막 언어 : {lang['title']}")
            return scripts
        return None

    def get_transcript(self, video_id: str) -> str:
        """ Transcript 응답을 기반으로 우선 순위가 높은 언어의 Param을 반환합니다.

        Args:
            res: 자막, 자막 언어 데이터

        Returns:
            dict: 우선 순위가 가장 높은 언어 Param
        """
        # 영상 자막 데이터 가져오기
        res = Transcript.get(video_id)

        visit_params = set()

        # 우선 순위 1: 작성된 영어, 한국어의 자막 확인
        for lang in res["languages"]:
            if lang['title'] in self.priority_lang:
                visit_params.add(lang['params'])
                script = self.fetch_and_format_transcript(video_id, lang)
                if script:
                    return script
        logger.info(f"{settings.LOG_SUMMARY_PREFIX}_매뉴얼 한국어/영어 자막 없음")

        # 우선 순위 2: 자동 생성된 영어, 한국어의 자막 확인
        for lang in res["languages"]:
            if lang['params'] in visit_params:
                continue

            if 'English' in lang['title'] or 'Korean' in lang['title']:
                visit_params.add(lang['params'])
                script = self.fetch_and_format_transcript(video_id, lang)
                if script:
                    return script
        logger.info(f"{settings.LOG_SUMMARY_PREFIX}_자동 생성 한국어/영어 자막 없음")

        # 우선 순위 3: 아무 자막이나 가져오기
        for lang in res["languages"]:
            if lang['params'] in visit_params:
                continue
            script = self.fetch_and_format_transcript(video_id, lang)
            if script:
                return script
        logger.info(f"{settings.LOG_SUMMARY_PREFIX}_영상 자막 없음")

        return settings.YOUTUBE_TRANSCRIPT_NO_VALID_STR

    async def summarize_recipe(self, video_id: str) -> str:
        """ 주어진 영상 ID를 기반으로 자막을 가져와 OpenAI API로 요약된 레시피를 반환합니다.

        Args:
            video_id(str): 유튜브 비디오 ID

        Returns:
            str: 레시피 요약 데이터
        """
        start = time.time()

        scripts = ""

        try:
            scripts = self.get_transcript(video_id)
            # 적절하지 않은 자막 추출 시 에러 코드 반환
            if scripts == settings.YOUTUBE_TRANSCRIPT_NO_VALID_STR:
                return settings.YOUTUBE_NOT_VALID_TRANSCRIPT_CDOE
        except Exception as e:
            logger.error(f"{settings.LOG_SUMMARY_PREFIX}_유튜브 자막 추출 오류: {e}")

        # OpenAI 요청을 위한 메시지 구성
        system_input = SUMMARY_SYSTEM_INPUT
        user_input = copy.deepcopy(SUMMARY_USER_INPUT)

        try:
            # youtube api 키 라운드 로빈
            await rotate_youtube_api_key()

            # 유튜브 API 객체
            youtube = build("youtube", "v3",
                            developerKey=settings.YOUTUBE_API_KEY)

            # video_id에 해당하는 영상 가져오기
            response = youtube.videos().list(
                part='snippet',
                id=video_id
            ).execute()

            # 데이터에서 description만 추출
            video_description = response['items'][0]['snippet']['description']

            # 예외 처리
            # 영상 설명 데이터가 정해놓은 글자 수보다 적다면, 레시피 데이터가 아니라고 가정
            if len(video_description) >= settings.YOUTUBE_DESCRIPTION_LEN_TH:
                # GPT API 입력 프롬프트에 추가
                user_input += SUMMARY_DESCRIPTION_INPUT
                user_input.append(
                    {"role": "user", "content": video_description})
                logger.info(f"{settings.LOG_SUMMARY_PREFIX}_영상 설명 데이터 추가")

        except Exception as e:
            logger.error(
                f"{settings.LOG_SUMMARY_PREFIX}_유튜브 영상 설명 추가 중 오류: {e}")

        # Few shot 데이터 적용
        user_input += SUMMARY_FEW_SHOT_DATA

        # 마지막 입력에 자막 스크립트 삽입
        user_input.append({"role": "user", "content": ""})
        user_input[-1]["content"] = scripts

        try:
            # OpenAI API 호출 (RequestGPT.run이 비동기 함수라고 가정)
            summary = await self.request_gpt.run(system_input, user_input)

            end = time.time()
            if summary["title"] == "None":
                return settings.SUMMARY_NOT_COOKCING_VIDEO

            if self.debug_mode:
                time_dict = {"exec time cons": f"{end - start:.5f}"}
                summary = summary | time_dict
            logger.info(
                f"{settings.LOG_SUMMARY_PREFIX}_전체 처리 완료 : {end - start:.2f} 초 소요")

            # 리턴 타입 검사
            assert isinstance(
                summary, dict), f"Excepted return type of summarize_recipe is dict, but got {type(summary)}"

            return summary
        except Exception as e:
            logger.error(f"{settings.LOG_SUMMARY_PREFIX}_요약 API 호출 오류: {e}")
            raise HTTPException(status_code=500, detail="요약 처리 중 오류가 발생했습니다.")


if __name__ == "__main__":
    async def main():
        try:
            recipe_summary = RecipeSummary()
            summary = await recipe_summary.summarize_recipe("qWbHSOplcvY")
            print(summary)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"요약 처리 중 오류가 발생했습니다: {e}")
    asyncio.run(main())
