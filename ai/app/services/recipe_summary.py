# app/services/recipe_summary.py
import time
import logging

import asyncio

from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound
from app.services.LLM.openai_api import RequestGPT

from fastapi import HTTPException
from app.utils.prompts.few_shot import SUMMARY_FEW_SHOT_DATA_DICT
from app.utils.prompts.user_input_caution import SUMMARY_EXTRA_INPUT
from app.core.config import settings

logger = logging.getLogger(__name__)

class RecipeSummary:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        if not self.api_key:
            logger.error("OPENAI_API_KEY가 설정되지 않았습니다.")
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY가 설정되지 않았습니다.")
        # OpenAI 클라이언트 (비동기) 생성 – YoutubeQuery와 유사하게 생성자에서 한 번만 초기화
        self.request_gpt = RequestGPT(self.api_key)

    def safe_find(self, method, languages):
        try:
            return method(languages)
        except NoTranscriptFound:
            return None

    async def get_transcript(self, video_id: str):
        """
        유튜브 영상 ID를 받아 자막(번역 포함)을 가져옵니다.
        """
        transcripts_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # 영어 자막을 우선적으로 가져오기기
        transcript = (
            self.safe_find(transcripts_list.find_manually_created_transcript, ['en'])
            or self.safe_find(transcripts_list.find_manually_created_transcript, transcripts_list._manually_created_transcripts.keys())
            or self.safe_find(transcripts_list.find_generated_transcript, ['en'])
            or self.safe_find(transcripts_list.find_generated_transcript, transcripts_list._generated_transcripts.keys())
        )

        if transcript is None:
            logger.error("사용 가능한 자막이 없습니다.")
            return None
            
        # 자막 데이터 가져오기
        return transcript.fetch()
    
    async def summarize_recipe(self, video_id: str) -> str:
        """
        주어진 영상 ID를 기반으로 자막을 가져와 OpenAI API로 요약된 레시피를 반환합니다.
        """
        start = time.time()
        transcription = await self.get_transcript(video_id)
        if transcription is None:
            raise HTTPException(status_code=404, detail="자막을 가져올 수 없습니다.")

        # 자막 텍스트를 모두 결합
        scripts = "".join([item["text"].replace("\n", " ").replace("\r", " ") for item in transcription])

        # OpenAI 요청을 위한 메시지 구성
        system_input = [
            {
                "role": "system",
                "content": "너는 주어진 스크립트를 읽고 요약을 잘하는 인공지능이야."
            },
            {
                "role": "system",
                "content": "너는 레시피 스크립트만 보고도 어떤 요리 도구를 사용해야 할 지 유추할 수 있어."
            },
            {
                "role": "system",
                "content": "스크립트가 한국어로 번역되어서 보여질텐데, 너는 이것을 자연스럽게 한국어로 변환할 수 있어."
            },
            {
                "role": "system",
                "content": "너는 주어지지 않는 정보를 맘대로 유추하지 않아."
            }
        ]
        user_input = [
            {
                "role" : "user",
                "content" : "내가 아래에 준 요리 레시피를 요약해줘."
            },
        ]

        # user input 추가 정보
        for data in SUMMARY_EXTRA_INPUT:
            user_input.append(data)

        # few shot 데이터 정보
        for data in SUMMARY_FEW_SHOT_DATA_DICT:
            user_input.append(data)

        # 마지막 입력에 자막 스크립트 삽입
        user_input[-1]["content"] = scripts

        try:
            # OpenAI API 호출 (RequestGPT.run이 비동기 함수라고 가정)
            recipe_summary = await self.request_gpt.run(system_input, user_input)
            end = time.time()
            print(f"\n{end - start:.5f} sec")
            time_dict = {"exec time cons" : f"{end - start:.5f}"}
            summary = recipe_summary | time_dict
            return summary
        except Exception as e:
            logger.error(f"요약 API 호출 오류: {e}")
            raise HTTPException(status_code=500, detail="요약 처리 중 오류가 발생했습니다.")
        
# if __name__ == "__main__":
#     async def main():
#         try:
#             recipe_summary = RecipeSummary()
#             summary = await recipe_summary.summarize_recipe("nVzwOOJLt24")
#             print(summary)
#         except HTTPException as e:
#             raise e
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"요약 처리 중 오류가 발생했습니다: {e}")
#     asyncio.run(main())