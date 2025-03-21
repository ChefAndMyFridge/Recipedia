# app/services/recipe_summary.py
import time
import asyncio

from youtubesearchpython import Transcript
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

    async def summarize_recipe(self, video_id: str) -> str:
        """ 주어진 영상 ID를 기반으로 자막을 가져와 OpenAI API로 요약된 레시피를 반환합니다.

        Args:
            video_id(str): 유튜브 비디오 ID

        Returns:
            str: 레시피 요약 데이터
        """
        if self.debug_mode:
            start = time.time()

        # 비디오 Id에 대한 자막 가져오기
        transcription = Transcript.get(video_id)

        # 자막 텍스트를 모두 결합
        scripts = " ".join([f"[{(int(item['startMs']) // 1000)}]" + item["text"].replace(
            "\n", "").replace("\r", "") for item in transcription["segments"]])

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
