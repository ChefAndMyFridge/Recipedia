# app/services/recipe_summary.py
import time
import asyncio

from youtubesearchpython import Transcript, Video
from app.services.LLM.recipe_generator import RequestGPT
from fastapi import HTTPException
from app.utils.prompts.few_shot import SUMMARY_FEW_SHOT_DATA
from app.utils.prompts.recipe_summary_prompts import SUMMARY_SYSTEM_INPUT, SUMMARY_USER_INPUT, SUMMARY_DESCRIPTION_INPUT
from app.core.config import settings
from app.core.logging_config import logger


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

    def get_transcript_params(self, res: dict) -> str:
        """ Transcript 응답을 기반으로 우선 순위가 높은 언어의 Param을 반환합니다.

        Args:
            res: 자막, 자막 언어 데이터

        Returns:
            dict: 우선 순위가 가장 높은 언어 Param
        """
        # 작성된 영어, 한국어의 자막이 있다면 가져오기
        en_ko_manually_data = [
            lang for lang in res["languages"] if lang['title'] in self.priority_lang]

        if len(en_ko_manually_data) > 0:
            logger.info(
                f"{settings.LOG_SUMMARY_PREFIX}_사용된 자막 : {en_ko_manually_data[0]['title']}")
            return en_ko_manually_data[0]["params"]

        # 자동 생성된 영어, 한국어의 자막이 있다면 가져오기
        en_ko_generated_data = [lang for lang in res['languages'] if any(
            keyword in lang['title'] for keyword in ['English', 'Korean'])]

        if len(en_ko_generated_data) > 0:
            logger.info(
                f"{settings.LOG_SUMMARY_PREFIX}_사용된 자막 : {en_ko_generated_data[0]['title']}")
            return en_ko_generated_data[0]["params"]

        # 없다면, 있는 자막 중 아무거나 가져오기
        logger.info(
            f"{settings.LOG_SUMMARY_PREFIX}_사용된 자막 : {res['languages'][-1]['title']}")
        return res["languages"][-1]["params"]

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
            # 영상 자막 데이터 가져오기
            res = Transcript.get(video_id)

            # 영상에서 지원하는 자막 Param을 우선순위에 따라서 가져오기
            param = self.get_transcript_params(res)

            # 특정 언어에 대한 자막 가져오기
            transcription = Transcript.get(video_id, param)

            # 자막 텍스트를 모두 결합
            scripts = " ".join([f"[{(int(item['startMs']) // 1000)}]" + item["text"].replace(
                "\n", "").replace("\r", "") for item in transcription["segments"]])
        except Exception as e:
            logger.error(f"{settings.LOG_SUMMARY_PREFIX}_유튜브 자막 추출 오류: {e}")

        # OpenAI 요청을 위한 메시지 구성
        system_input, user_input = SUMMARY_SYSTEM_INPUT, SUMMARY_USER_INPUT

        # try:
        #     # 비디오 설명이 있다면, 이를 프롬프트에 추가
        #     video_info = Video.getInfo(video_id)
        #     logger.info(
        #         f"{settings.LOG_SUMMARY_PREFIX}_video_info\n {video_info}")
        #     if 'description' in video_info and video_info['description'] and (len(video_info['description']) > settings.YOUTUBE_DESCRIPTION_LEN_TH):
        #         user_input += SUMMARY_DESCRIPTION_INPUT
        #         user_input.append(
        #             {"role": "user", "content": video_info['description']})
        # except Exception as e:
        #     logger.error(
        #         f"{settings.LOG_SUMMARY_PREFIX}_유튜브 영상 설명 추가 중 오류: {e}")

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
            summary = await recipe_summary.summarize_recipe("BBy9iBzZanw")
            print(summary)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"요약 처리 중 오류가 발생했습니다: {e}")
    asyncio.run(main())
