# app/utils/docs.py
from app.models.ingredients import Ingredients
from app.models.youtube_url import YoutubeURL


class QueryDocs:
    base = {
        "res": {
            200: {
                "description": "레시피 영상 URL 획득 성공",
                "content": {
                    "application/json": {
                        "example": {
                            "dishes": [
                                "불고기 (한식)",
                                "소고기 볶음밥 (중식)",
                                "페퍼 스테이크 (양식)"
                            ],
                            "videos": {
                                "불고기 (한식)": [
                                    {
                                        "title": "양념 4개면 '소불고기' 끝!",
                                        "url": "https://www.youtube.com/watch?v=nVzwOOJLt24",
                                        "description": "#백종원 #소불고기 #한식\n한식대표음식 중 하나인 '소불고기' 입니다.\n여러 방법이 있지만 오늘은 제일 간단한 방법으로 준비해봤습니다.\n오늘 저녁은 소불고기에 한쌈 어떠세요?\n\n==================\n\n소불고기 (4인분)\n\n[재료]\n\n* 양념장 재료\n황설탕 2와1/2큰술(30g)\n물엿 1큰술(12g)\n간 마늘 1큰술(20g)\n진간장 5큰술(50g)\n후춧가루 약간\n참기름 3큰술(21g)\n\n* 소불고기 재료\n소고기 불고기용 500g\n양파 3/5개(150g)\n표고버섯 2개(40g)\n대파 약1대(80g) \n홍고추 1개(10g)\n통깨 약간\n\n\n[만드는 법]          \n\n1. 깊은 볼에 한입 크기로 자른 소고기를 넣고 잘 풀어서 준비한다.\n2. 소고기에 황설탕, 물엿, 간 마늘을 넣고 골고루 버무려 약 10~20분 정도 재운다. \n  Tip: 설탕의 분자가 다른 양념류보다 크기 때문에 가장 먼저 넣어서 단맛을 배게 한다.\n3. 표고버섯은 기둥을 제거하고 두께 0.3cm 정도로 얇게 썬다. \n4. 대파, 홍고추는 두께 0.5cm 정도로 어슷썰어 준비한다.\n5. 양파는 꼭지를 제거하고 두께 0.5cm 정도로 채썰어 준비한다. \n6. 재워둔 소고기에 진간장을 넣고 고기가 부서지지 않도록 조심히 섞어준 후 양파, 대파, 홍고추, 표고버섯을 넣어 섞는다.\n7. 채소 위에 후춧가루, 참기름을 넣고 섞는다. \n  Tip: 다음날 사용한다면 대파만 넣어서 냉장 보관하여 사용 당일 나머지 채소를 넣어 조리한다. \n8. 팬을 강 불에 올려 예열하고 소불고기를 올려 재료를 집게나 젓가락으로 잘 풀어주면서 볶는다.\n  Tip: 기호에 따라 MSG 1/4큰술 정도를 넣어 볶는다.\n9. 완전히 익은 소불고기를 접시에 담고 통깨를 뿌려 완성한다.\n\n\n\nBeef bulgogi (4 servings)\n\n[Ingredients]\n\n* Sauce\n2 1/2 tbsp (30g) brown sugar\n1 tbsp (12g) starch syrup\n1 tbsp (20g) minced garlic\n5 tbsp (50g) thick soy sauce\nBlack pepper\n3 tbsp (21g) sesame oil\n\n* Beef bulgogi\n500g beef for bulgogi\n3/5 (150g) onion\n2 (40g) shiitake mushrooms\n1 stalk (80g) green onion\n1 (10g) red chili pepper\nSesame seeds\n\n\n[Directions] \n\n1. Cut the beef into bite sizes and place them in a large bowl. Gently untangle the meat to prepare.\n2. Add brown sugar, starch syrup, and minced garlic to the beef and evenly mix. Marinate for 10-20 minutes.\nTip: Because sugar particles are larger than other ingredients, add the sugar first to let the sweetness get into the meat.\n3. Remove the stem of shiitake mushroom and slice thinly at 0.3cm thickness. \n4. Slice the green onion and red chili pepper diagonally 0.5cm thick.\n5. Trim the tip of onion and slice at 0.5cm thickness.\n6. Add thick soy sauce to the marinated beef and mix gently not to break the meat. Add onion, green onion, red chili pepper, and shiitake mushroom. Mix well.\n7. Add black pepper and sesame oil on top of the vegetables and mix. \nTip: Add only the green onion and store it in the fridge if cooking the next day. Add the other vegetables on the day when you actually cook it. \n8. Pre-heat the pan on high heat and cook the beef bulgogi. Stir gently with tongs or chopsticks to untangle the meat.\nTip: Add 1/4 tbsp of MSG if desired.\n9. Once completely cooked, place the beef bulgogi on a plate and finish by sprinkling some sesame seeds.\n\n\n한식을 사랑하는 외국인분들을 위해 외국어 자막을 첨부하였습니다.\n본 영상의 자막은 통합 언어 플랫폼 ‘플리토’와 함께 합니다.\nSubtitles in foreign languages are provided for everyone who loves Korean food.\nAll subtitles are provided by an integrated language platform, Flitto.\nhttps://www.flitto.com/business/video-translation",
                                        "channel_title": "백종원 PAIK JONG WON",
                                        "published_at": "2020-10-27T09:06:36Z",
                                        "duration": "11:39",
                                        "view_count": 4630935,
                                        "like_count": 47789,
                                        "comment_count": 1139
                                    }
                                ],
                                "소고기 볶음밥 (중식)": [
                                    {
                                        "title": "[이연복] 고기 볶음밥",
                                        "url": "https://www.youtube.com/watch?v=Gp3AqI76Fyk",
                                        "description": "《재료》\n돼지 고기 50g (부위 무관)\n계란\n당근, 파\n기름\n굴소스\n\n《레시피》\n(즉석밥 1개 200g 기준)\n1. 즉석밥의 뚜껑을 완전히 제거한 뒤, 전자 레인지에 2분간 돌려주세요. (밥솥 사용시, 수분이 최대한 적은 꼬들 밥이 좋습니다)\n\n*밥의 수분을 최대한 제거해 주시는게 좋습니다*\n\n2. 준비하신 돼지고기를 작게 깍둑썰기 해주세요.\n3. 당근과 파를 잘게 썰어주세요. (기호에 맞게 좋아하시는 야채 및 버섯 등을 추가하셔도 됩니다 :))\n4. 프라이팬에 기름을 충분히 두른 후, 고기를 먼저 볶은 뒤, 사용하신 기름은 그대로 두시고 고기만 따로 빼주세요.\n5. 프라이팬에 계란 1개를 넣은 후, 계란을 해쳐서 잘 익혀주세요.\n6. 계란이 적당히 익으면 즉석밥을 넣어주세요.\n7. 굴소스 한스푼, 파, 당근을 넣고 볶아주세요.\n8. 마지막으로 따로 빼두었던 고기를 넣고 볶아주세요.",
                                        "channel_title": "이연복의 복주머니",
                                        "published_at": "2021-07-14T09:00:06Z",
                                        "duration": "8:27",
                                        "view_count": 1209040,
                                        "like_count": 20930,
                                        "comment_count": 884
                                    }
                                ],
                                "페퍼 스테이크 (양식)": [
                                    {
                                        "title": "소고기 볶음 레시피 ㅣ 베이킹 소다 연육 시리즈 - 저렴한 부위 30분만에 안심처럼 연하게 만드는 법",
                                        "url": "https://www.youtube.com/watch?v=CWXPUpr_iHw",
                                        "description": "소고기 볶음 레시피, 오늘은 블랙 페퍼 스테이크, 중국식 찹 스테이크 레시피를 공유합니다. 동네에 아주 좋아하는 중식당이 있는데 거기 갈때마다 시켜먹는 메뉴가 있는데 그걸 제 방식으로 만들어 봤습니다. 베이킹 소다 연육을 통해 저렴한 부위를 아주 부드러운 식감으로 바꿔주는 꿀팁과 함께 곁들여서 먹기 아주 최적인 블랙페퍼스테이크 레시피까지 함께 정리했습니다. 즐겁게 요리 하시고 맛있는 식사 하세요. \n\n재료\n소고기 (블레이드 로스트, 목심) 850g\n베이킹 소다 1 tsp\n생수 500 ml\n\n고기양념\n굴소스 2 Tbsp\n간장 2 tsp\n후추 1 Tbsp\n옥수수 전분 2 Tbsp\nMSG 2 tsp\n매실액 1 Tbsp\n샤오싱주 2 Tbsp\n물 3 Tbsp\n\n볶음 소스\n샤오싱주 3 Tbsp\n옥수수 전분 2 Tbsp\n물 2 Tbsp\n설탕 1 Tbsp\n간장 1 Tbsp\n노두 1 Tbsp\n굴소스 2 tsp\n우스터소스 1/2 tsp\n\n채소 \n피망 1 ea\n적양파 1 ea\n마늘 6 cloves\n양송이 (크레미니) 8 ea\n\n채널 구독과 좋아요는 영상제작에 많은 힘이 됩니다. 함께 즐겨주세요. 감사합니다.\n더 프로키친 채널을 구독하며 함께 요리하시려면 여기로:\nhttps://bit.ly/3dVMQiA\n\n인스타 계정:\n더 프로키친: https://www.instagram.com/the_prokitchen/\n에릭 오 셰프: https://www.instagram.com/fire_all_tables/\n\nProducts I Can Recommend (These are my affiliate links so I earn a tiny commission upon your purchase so thank you very much for your support=)\n\nWustof Boning Knife: https://amzn.to/2J6VVL7\n\nANOVA NANO Precision Sousvide Cooker: https://amzn.to/3hdz9fj\n\nGeryon Vacuum Sealer: https://amzn.to/2EZ3MZe\n\nMeater Bluetooth Probe Thermometer: https://amzn.to/3bzH1qx\n\nIwatani Portable Gas Burner: https://amzn.to/3263rfK\n\nVitamix 5200 Blender Professional Grade: https://amzn.to/3h9ddCn\n\nEverdure Charcoal Grill: https://amzn.to/3274JXQ\n\nStone Pestle and Mortar: https://amzn.to/2ZfVDq8\n\nPotato Ricer: https://amzn.to/3729e9e\n\nWebsite: https://www.theprokitchen.com\nAll business inquiries: eric@theprokitchen.com",
                                        "channel_title": "더 프로키친 [The Prokitchen]",
                                        "published_at": "2022-03-02T12:00:04Z",
                                        "duration": "11:47",
                                        "view_count": 45630,
                                        "like_count": 981,
                                        "comment_count": 127
                                    }
                                ]
                            },
                        }
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        },
        "data": Ingredients(ingredients=["소고기", "계란", "파", "마늘", "양파"], main_ingredients=["소고기", "파"]),

    }


class RecipeDocs:
    base = {
        "res": {
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
        "data": YoutubeURL(youtube_url="https://www.youtube.com/watch?v=eIo2BaE6LxI")
    }


class RootDocs:
    base = {
        "res": {
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
