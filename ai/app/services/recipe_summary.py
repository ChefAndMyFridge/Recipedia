# app/services/recipe_summary/summary_test.py
import time
import logging

from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
from app.services.LLM.openai_api import *

from fastapi import HTTPException
from app.utils.prompts.few_shot import *
from app.utils.prompts.user_input_caution import *
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

    async def get_transcript(self, video_id: str, target_language: str = 'ko'):
        """
        유튜브 영상 ID를 받아 자막(번역 포함)을 가져옵니다.
        """
        try:
            # 자막  목록 가져오기
            transcripts_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            try:
                # 수동 생성된 자막이 있으면 우선적으로 사용
                transcript = transcripts_list.find_manually_created_transcript(
                    transcripts_list._manually_created_transcripts.keys()
                )
            except NoTranscriptFound:
                try:
                    # 자동 생성된 자막 중 영어('en')뿐만 아니라 다른 언어도 포함해서 가져오기
                    transcript = transcripts_list.find_generated_transcript(
                        transcripts_list._generated_transcripts.keys()
                    )
                except NoTranscriptFound:
                    logger.error("사용할 수 있는 자동 생성 자막이 없습니다.")
                    return None
                
            # 원하는 언어로 번역
            translated_transcript = transcript.translate(target_language)
            
            # 자막 데이터 가져오기
            return translated_transcript.fetch()
        
        except TranscriptsDisabled:
            logger.error(f"이 영상은 자막이 비활성화되었습니다.")
        except NoTranscriptFound:
            logger.error(f"이 영상에 사용할 수 있는 자막이 없습니다.")
        except Exception as e:
            logger.error(f"오류 발생: {e}")
        return None

    async def summarize_recipe(self, video_id: str) -> str:
        """
        주어진 영상 ID를 기반으로 자막을 가져와 OpenAI API로 요약된 레시피를 반환합니다.
        """
        start = time.time()
        transcription = await self.get_transcript(video_id)
        if transcription is None:
            raise HTTPException(status_code=404, detail="자막을 가져올 수 없습니다.")

        # 자막 텍스트를 모두 결합
        scripts = "".join([item["text"] for item in transcription])
        
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
            summary = await self.request_gpt.run(system_input, user_input, False)
            end = time.time()
            print(f"\n{end - start:.5f} sec")
            return summary
        except Exception as e:
            logger.error(f"요약 API 호출 오류: {e}")
            raise HTTPException(status_code=500, detail="요약 처리 중 오류가 발생했습니다.")