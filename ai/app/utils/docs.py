# app/utils/docs.py
from app.models.ingredients import Ingredients
from app.models.youtube_url import YoutubeURL

class QueryDocs:
    base = {
        "res" : {
            200: {
                "description": "레시피 영상 URL 획득 성공",
                "content": {
                    "application/json": {
                        "example": {
                            "dishes": [
                                "소고기 볶음",
                                "소고기 계란찜",
                                "소고기 파전",
                                "소고기 마늘구이",
                                "소고기 양파 스튜",
                                "소고기 계란 볶음밥"
                            ],
                            "videos": {
                                "소고기 계란찜": [
                                {
                                    "title": "세상 간단한 방법으로 [고기집 계란찜] 절대 실패 없이 맛있게...",
                                    "url": "https://www.youtube.com/watch?v=U214WlL45jA",
                                    "relevance_score": 0.5
                                },
                                {
                                    "title": "왕초보도 실패하지 않는 폭탄계란찜 비법은 뚝배기 선택 | 포인트만 알면 정말 쉬운 폭탄 달걀찜",
                                    "url": "https://www.youtube.com/watch?v=7UTF-yAGKUg",
                                    "relevance_score": 0.5
                                },
                                {
                                    "title": "20초 뚝배기 계란찜",
                                    "url": "https://www.youtube.com/watch?v=iAKKSiTZhXI",
                                    "relevance_score": 0.3
                                }
                                ],
                                "소고기 파전": [
                                {
                                    "title": "부침가루에 그냥 물 넣지 마세요! 집에 있는 이걸 넣으면 2배 바삭바삭 전이 맛있어져요~! /파전, 파전 만들기, 파전 바삭하게 하는법, 부추전, 해물파전",
                                    "url": "https://www.youtube.com/watch?v=Z2q-1zffE_8",
                                    "relevance_score": 0.6
                                },
                                {
                                    "title": "해물 파전 노하우 Korean pancake recipe",
                                    "url": "https://www.youtube.com/watch?v=IlDUjNsdCC4",
                                    "relevance_score": 0.3
                                },
                                {
                                    "title": "바삭한 전 만들기 속성과외📚",
                                    "url": "https://www.youtube.com/watch?v=LtSKLhV37Ws",
                                    "relevance_score": 0.2
                                }
                                ],
                                "소고기 계란 볶음밥": [
                                {
                                    "title": "한국에서 제일 많이 본 달걀볶음밥 레시피",
                                    "url": "https://www.youtube.com/watch?v=nmLO04GfA0k",
                                    "relevance_score": 0.5
                                },
                                {
                                    "title": "이렇게 쉽다고?? 계란 볶음밥 만들기",
                                    "url": "https://www.youtube.com/watch?v=RUgH6TBDtsM",
                                    "relevance_score": 0.5
                                },
                                {
                                    "title": "[계란 볶음밥] 중국집 보다 맛있는 볶음밥 레시피",
                                    "url": "https://www.youtube.com/watch?v=xv_z7XY4aZo",
                                    "relevance_score": 0.3
                                }
                                ],
                                "소고기 양파 스튜": [
                                {
                                    "title": "토마토 비프 스튜 만드는 법 소고기 토마토 스튜 레시피 레드 와인 소고기 등심 홀토마토 요리 스타우브 스튜 만들기 보양식 #토마토스튜 #비프스튜 #토마토비프스튜",
                                    "url": "https://www.youtube.com/watch?v=BYH0hUPHJSE",
                                    "relevance_score": 0.5
                                },
                                {
                                    "title": "이탈리안보양식 토마토비프스튜 쉽게 만드는 방법",
                                    "url": "https://www.youtube.com/watch?v=y-13uymxwLE",
                                    "relevance_score": 0.3
                                },
                                {
                                    "title": "카레보다 더 쉬운 소고기 토마토 스튜 만들기 다이어트 식단 홈파티 메뉴 굴라쉬 레시피",
                                    "url": "https://www.youtube.com/watch?v=fs1ETa1FAtI",
                                    "relevance_score": 0.2
                                }
                                ],
                                "소고기 볶음": [
                                {
                                    "title": "지금 당장 소고기사서 만들어 보세요❗️ 밥도둑 소고기 볶음",
                                    "url": "https://www.youtube.com/watch?v=_yl05thA1Dw",
                                    "relevance_score": 1
                                },
                                {
                                    "title": "미친 소고기 볶음 😋, 만드는데 20분 (몽골리안 비프)",
                                    "url": "https://www.youtube.com/watch?v=8Dkp3rO2mqs",
                                    "relevance_score": 0.8
                                },
                                {
                                    "title": "소고기 볶음 요리 중 무조건 1등 #몽골리안비프",
                                    "url": "https://www.youtube.com/watch?v=YY3dXcXT50Y",
                                    "relevance_score": 0.8
                                }
                                ],
                                "소고기 마늘구이": [
                                {
                                    "title": "(182번째 요리)  마늘소스소고기",
                                    "url": "https://www.youtube.com/watch?v=PqVc9bLvcdk",
                                    "relevance_score": 0.6
                                },
                                {
                                    "title": "마늘폭탄소갈비와 전자레인지 사용 가능한 스텐용기까지👇🏻클릭해서 상세내용 확인해 주세요. #살림템 #주방용품 #소고기 #스텐316",
                                    "url": "https://www.youtube.com/watch?v=ed2iN_n1iDI",
                                    "relevance_score": 0.3
                                },
                                {
                                    "title": "👍300만💕 수입산 소고기 맛있는 먹는 방법 #shorts",
                                    "url": "https://www.youtube.com/watch?v=AnBOQjMqBLs",
                                    "relevance_score": 0.2
                                }
                                ]
                            },
                            "execution_time": 3.148292064666748
                        }
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        },
        "data" : Ingredients(ingredients=["소고기", "계란", "파", "마늘", "양파"], main_ingredient="소고기"),
        
    }

class RecipeDocs:
    base = {
        "res" : {
            200: {
                "description": "텍스트 레시피 추출 성공",
                "content": {
                    "application/json": {
                        "example": {
                            "title": "소시지 김치볶음밥",
                            "cooking_info": {
                                "cooking_time": "15",
                                "kcal": 500
                            },
                            "ingredients": [
                                "소시지 2개(65g)",
                                "김치 1컵(160g)",
                                "즉석밥 1개",
                                "파 1/2컵(40g)",
                                "식용유 3큰술(20g)",
                                "설탕 1/3큰술(3g)",
                                "간장 1/2큰술(5g)",
                                "고운 고춧가루 1/3큰술(3g)",
                                "가루 참깨 약간",
                                "계란 1개",
                                "김가루 약간"
                            ],
                            "cooking_tools": [
                                "후라이팬",
                                "도마",
                                "칼",
                                "가위",
                                "숟가락",
                                "절구"
                            ],
                            "cooking_tips": [
                                "김치는 신맛이 나는 것을 사용하세요.",
                                "김치의 물기를 잘 짜내고 사용하세요.",
                                "즉석밥은 봉지에서 바로 사용하세요.",
                                "파를 기름에 우려내어 향을 더하세요.",
                                "김치가 물기가 많으면 물을 추가하지 않아도 됩니다."
                            ],
                            "cooking_sequence": {
                                "재료 손질": [
                                "소시지를 얇게 썰고, 파를 반으로 썰어 다집니다.",
                                "김치는 가위로 잘라 준비합니다."
                                ],
                                "팬 예열": [
                                "팬에 식용유(3큰술)를 두르고 중불에서 예열합니다."
                                ],
                                "파와 소시지 볶기": [
                                "파를 넣고 기름에 우려낸 후 소시지를 넣고 노릇노릇해질 때까지 볶습니다."
                                ],
                                "양념 추가": [
                                "설탕(1/3큰술)과 간장(1/2큰술)을 넣고 볶습니다."
                                ],
                                "김치 넣기": [
                                "김치를 넣고 잘 섞어줍니다."
                                ],
                                "밥 넣기": [
                                "즉석밥을 넣고 잘 부수어가며 재료와 섞습니다."
                                ],
                                "마무리": [
                                "불을 끄고 참깨와 김가루를 뿌립니다.",
                                "계란후라이를 만들어 김치볶음밥 위에 올립니다."
                                ],
                                "완성 및 서빙": [
                                "김치볶음밥을 그릇에 담고 계란후라이와 함께 서빙합니다."
                                ]
                            }
                        }
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        },
        "data" : YoutubeURL(youtube_url="https://www.youtube.com/watch?v=eIo2BaE6LxI")
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