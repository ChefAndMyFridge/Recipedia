# app/services/query_maker.py

from app.models.ingredients import Ingredients
from app.core.config import settings
import httpx
import openai

class YoutubeQuery:
    def __init__(self):
        self.youtube_key = settings.YOUTUBE_API_KEY
        self.openai_key = settings.OPENAI_API_KEY
        self.base_url = "https://www.googleapis.com/youtube/v3/search"
        self.openai_model = "gpt-4o-mini"

    async def make_query_from_items(self, data: Ingredients):
        # 재료 리스트를 "재료 - 갯수개" 형식의 문자열로 변환
        ingredients_list = "\n".join([f"{item} - {quantity}개" for item, quantity in data.items.items()])

        try:
            client = openai.AsyncOpenAI(api_key=self.openai_key)  # ✅ 비동기 클라이언트 사용

            # 프롬프트 구성
            system_prompt = (
                f"당신은 건강과 영양을 고려한 요리 레시피 검색 전문가입니다.\n"
                f"사용자의 건강 상태와 식습관, 그리고 주어진 재료를 바탕으로, 유튜브에서 검색 시 적절한 레시피 영상이 노출될 수 있도록 간단하고 명확한 검색어를 생성하세요.\n" 
                # f"반드시 건강 제한(예: 당뇨 환자에게 적합한 식단)을 반영하여, 피해야 할 재료나 조리법이 없도록 주의하세요.\n"
            )
            prompt = (
                f"다음 재료들을 사용해서 만들 수 있는 요리 이름을 추천해줘.\n"
                f"추천은 유튜브에서 레시피를 검색할 때 적합하도록 간단한 요리 이름으로만 해줘.\n\n"
                f"실제로 존재하는 요리 이름으로 대답해줘"
                f"재료를 모두 사용하지는 않아도 되지만, 가능하면 대부분 포함되도록 해줘"
                f"재료 목록:\n{ingredients_list}\n\n"
                f"사용자: {data.user}"
            )

            messages = []
            messages.append({"role": "system", "content": system_prompt}) # 시스템 프롬프트로 컨셉 전달
            messages.append({"role": "user", "content": prompt})

            response = await client.chat.completions.create(
                model=self.openai_model,
                messages=messages,
                max_tokens=20,
            )
            
            # 모델의 응답에서 추천된 요리 이름 추출
            recipe_name = response.choices[0].message.content.strip()
            return recipe_name
        
        except openai.OpenAIError as e:
            print(f"[Error] OpenAI API 호출 실패: {str(e)}")
            return "죄송합니다, API 호출 중 오류가 발생했습니다."
    
    async def search_from_youtube(self, query: str):
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "videoDuration": "medium", # medium: 4분 이상 20분 미만
            "key": self.youtube_key,
            "maxResults": 5,
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(self.base_url, params=params)
            response.raise_for_status()  # 오류 발생 시 예외를 발생시킴
            data = response.json()
        
        # 결과에서 videoId를 추출하여 영상 URL 목록을 생성
        videos = [
            {
                "title": item["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            }
            for item in data.get("items", [])
        ]
        return videos
    
    # Video ID로 부터 상세 설명을 가져옵니다. 상세 설명에 아예 레시피가 정리된 경우도 많아 참고
    async def get_video_details(self, video_id: str):
        video_url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "part": "snippet",
            "id": video_id,
            "key": self.youtube_key,
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(video_url, params=params)
            response.raise_for_status()
            data = response.json()

        return data["items"][0]["snippet"]["description"]
