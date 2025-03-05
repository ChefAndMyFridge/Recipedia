# app/utils/docs.py
from app.models.ingredients import Ingredients

class QueryDocs:
    base = {
        "res" : {
            200: {
                "description": "레시피 영상 URL 획득 성공",
                "content": {
                    "application/json": {
                        "example": [
                            {
                                "title": "간단 계란파전! 계란말이보다 맛있는 추억의 계란부침개, 초간단 계란요리 | how to make best egg pancake JUNTV",
                                "url": "https://www.youtube.com/watch?v=dnT79gMtlfs"
                            },
                            {
                                "title": "부침가루에 그냥 물 넣지 마세요! 집에 있는 이걸 넣으면 2배 바삭바삭 전이 맛있어져요~! /파전, 파전 만들기, 파전 바삭하게 하는법, 부추전, 해물파전",
                                "url": "https://www.youtube.com/watch?v=Z2q-1zffE_8"
                            },
                            {
                                "title": "&quot;시장통 해물파전&quot; - 파전은 이렇게 만드는 겁니다~ Seafood and Green Onion Pancake",
                                "url": "https://www.youtube.com/watch?v=9120oxxZE-Y"
                            },
                            {
                                "title": "파전은 먹고 싶은데, 쪽파가 없다면?",
                                "url": "https://www.youtube.com/watch?v=12e93a8T2nU"
                            },
                            {
                                "title": "[성시경 레시피] 해물 파전 l Sung Si Kyung Recipe - Seafood Pancake",
                                "url": "https://www.youtube.com/watch?v=GSq_QbHyYMI"
                            }
                        ]
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        },
        "data" : Ingredients(items={"계란": 1, "파": 1}, user="아버지"),
        
    }

class RecipeDocs:
    base = {
        "res" : {
            200: {
                "description": "텍스트 레시피 추출 성공",
                "content": {
                    "application/json": {
                        "example": {
                                "summary": "레시피",
                                }
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        }
    }

class RootDocs:
    base = {
        "res" : {
            200: {
                "description": "서버 활성화",
                "content": {
                    "application/json": {
                        "example": {
                            "message": "Hello, FastAPI!"
                        }
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        }
    }