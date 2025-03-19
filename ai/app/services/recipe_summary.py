# app/services/recipe_summary.py
import time
import asyncio

from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled, VideoUnavailable
from app.services.LLM.recipe_generator import RequestGPT

from fastapi import HTTPException
from app.utils.prompts.few_shot import SUMMARY_FEW_SHOT_DATA
from app.utils.prompts.recipe_summary_prompts import SUMMARY_SYSTEM_INPUT, SUMMARY_USER_INPUT
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

        # 디버그 모드
        self.debug_mode = settings.DEBUG

    def safe_find(self, method, languages):
        """ 유튜브 자막을 try except 문으로 안전한게 찾아 반환합니다.

        Args:
            method: 유튜브 자막 찾는 메서드
            languages: 자막 언어

        Returns:
            Optional[method]: 찾고자 하는 메서드
        """
        try:
            return method(languages)
        except NoTranscriptFound:
            logger.warning(
                f"{settings.LOG_SUMMARY_PREFIX}_{languages} : 제공된 자막 없음")
            return None
        except TranscriptsDisabled:
            logger.warning(f"{settings.LOG_SUMMARY_PREFIX}_자막 비활성화")
            return None
        except VideoUnavailable:
            logger.warning(f"{settings.LOG_SUMMARY_PREFIX}_영상 사용 불가")
            return None
        except Exception as e:
            logger.error(f"{settings.LOG_SUMMARY_PREFIX}_자막 추출 중 에러 발생 : {e}")
            return None

    async def get_transcript(self, video_id: str) -> list[dict]:
        """ 유튜브 영상 ID를 받아 자막(번역 포함)을 가져옵니다.

        Args:
            video_id(str): 유튜브 비디오 ID

        Returns:
            list[dict]: 자막 데이터
        """
        transcripts_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # 제공된 한국어 자막을 우선 시도해보고, 영어 자막을 우선적으로 가져오기
        transcript = (
            self.safe_find(
                transcripts_list.find_manually_created_transcript, ['ko'])
            or self.safe_find(transcripts_list.find_manually_created_transcript, ['en'])
            or self.safe_find(transcripts_list.find_generated_transcript, ['en'])
            or self.safe_find(transcripts_list.find_manually_created_transcript, transcripts_list._manually_created_transcripts.keys())
            or self.safe_find(transcripts_list.find_generated_transcript, transcripts_list._generated_transcripts.keys())
        )

        if transcript is None:
            logger.error("{settings.LOG_SUMMARY_PREFIX}_사용 가능한 자막이 없습니다.")
            return None

        # 자막 데이터 가져오기
        try:
            result = transcript.fetch()
            # 1차 타입 검사 (스크립트 0차원 데이터) => list
            assert isinstance(
                result, list), f"Excepted return outter type of get_transcript is list[dict], but got {type(result)}"

            # 2차 타입 검사 (스크립트 1차원 데이터) => dict
            assert isinstance(
                result[0], dict), f"Excepted return inner type of get_transcript is list[dict], but got {type(result[0])}"

            return result
        except Exception as e:
            logger.error(
                f"{settings.LOG_SUMMARY_PREFIX}_자막 가져오는 중 에러 발생 : {e}")
            return None

    async def summarize_recipe(self, video_id: str) -> str:
        """ 주어진 영상 ID를 기반으로 자막을 가져와 OpenAI API로 요약된 레시피를 반환합니다.

        Args:
            video_id(str): 유튜브 비디오 ID

        Returns:
            str: 레시피 요약 데이터
        """
        if self.debug_mode:
            start = time.time()

        transcription = await self.get_transcript(video_id)
        if transcription is None:
            raise HTTPException(status_code=404, detail="자막을 가져올 수 없습니다.")

        # 자막 텍스트를 모두 결합
        scripts = " ".join([f"[{(int)(item['start'])}]" + item["text"].replace(
            "\n", "").replace("\r", "") for item in transcription])

        # OpenAI 요청을 위한 메시지 구성
        system_input, user_input = SUMMARY_SYSTEM_INPUT, SUMMARY_USER_INPUT

        # Few shot 데이터 적용
        user_input += SUMMARY_FEW_SHOT_DATA

        # 마지막 입력에 자막 스크립트 삽입
        user_input.append({"role": "user", "content": ""})
        user_input[-1]["content"] = scripts

        try:
            # OpenAI API 호출 (RequestGPT.run이 비동기 함수라고 가정)
            summary = await self.request_gpt.run(system_input, user_input)

            if self.debug_mode:
                end = time.time()
                time_dict = {"exec time cons": f"{end - start:.5f}"}
                print(f"\n{end - start:.5f} sec")
                summary = summary | time_dict

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
