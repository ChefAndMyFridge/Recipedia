correct_answer = {}
data_url = {}

# High Quality : Manually Script + Video Description

data_url["김치볶음밥"] = "https://www.youtube.com/watch?v=eIo2BaE6LxI"
correct_answer["김치볶음밥"] = """
{
    "title" : "김치 볶음밥",
    "cooking_info" : {
        "cooking_time" : "15분",
        "kcal" : 620
    },
    "ingredients" : [
        {
            "name" : "김치",
            "quantity": "1컵(160g)"
        },
        {
            "name" : "소시지",
            "quantity": "2개(65g)"
        },
        {
            "name" : "대파",
            "quantity": "1/2컵(40g)"
        },
        {
            "name" : "식용유",
            "quantity": "3큰술(20g)"
        },
        {
            "name" : "진간장",
            "quantity": "1/2큰술(5g)"
        },
        {
            "name" : "고춧가루",
            "quantity": "1/3큰술(3g)"
        },
        {
            "name" : "설탕",
            "quantity": "1/3큰술(3g)"
        },
        {
            "name" : "즉석밥",
            "quantity": "1개"
        },
        {
            "name" : "달걀",
            "quantity": "1개"
        },
        {
            "name" : "김가루",  
            "quantity": "약간"
        },
        {
            "name" : "깨소금",
            "quantity": "약간"
        }
    ],
    "cooking_tips" : [
        "덜 익은 김치와 설탕을 함께 사용하면 단 맛이 많이 나기 때문에 신김치를 사용합니다.",  
        "김치의 간이 약하다면 간장의 양을 늘립니다.",
        "수분이 부족하면 중간에 물을 함께 첨가하여 볶아줍니다."  
    ],
    "cooking_sequence" : {
        "재료 손질" : {
            "sequence": [
                "소시지는 얇게 썰고, 대파는 반으로 갈라 송송 썰어 준비합니다.",
                "김치는 가위로 잘게 잘라주세요."  
            ],
            "timestamp": 200
        },
        "팬 예열" : {
            "sequence": [
                "불을 켜서 팬을 달군 뒤, 식용유 3컵을 두릅니다.",
                "대파, 소시지를 넣고 노릇노릇 해질때까지 볶습니다."
            ],
            "timestamp": 296
        },
        "재료 볶기" : {
            "sequence": [
                "설탕과 간장을 넣고 수분이 증발하면 김치를 같이 넣고 볶습니다.",
                "고추가루를 넣어주고, 수분이 없다면 물을 조금 넣어 재료가 뭉치지 않게 섞어줍니다."    
            ],
            "timestamp": 368
        },
        "즉석밥 넣고 볶기" : {
            "sequence": [
                "불을 잠시 꺼줍니다.",
                "즉석밥 1개를 넣어주고 주걱으로 적당히 부신 뒤, 재료들과 섞어줍니다.",
                "불을 다시 켜고 밥을 볶아줍니다."
            ],
            "timestamp": 480
        },
        "마무리" : {
            "sequence": [
                "깨소금을 넣어줍니다.",
                "계란후라이를 만들어 만들어 둔 김치볶음밥 위에 올리고 김가루를 뿌려 마무리합니다.",
                "절구가 있다면, 깨를 갈아 넣어줍니다."
            ],
            "timestamp": 553
        }
    }
}
"""

data_url["된장찌개"] = "https://www.youtube.com/watch?v=ffuakdFmuh4"
correct_answer["된장찌개"] = """
{
    "title" : "된장찌개",
    "cooking_info" : {
        "cooking_time" : "20분",
        "kcal" : 330
    },
    "ingredients" : [
        {
            "name" : "된장",
            "quantity": "1/3컵(60g)"
        },
        {
            "name" : "물",
            "quantity": "약 4컵(750ml)"
        },
        {
            "name" : "간마늘",
            "quantity": "1/2큰술(8g)"
        },
        {
            "name" : "멸치",
            "quantity": "육수용 10마리(20g)"
        },
        {
            "name" : "애호박",
            "quantity": "1/2개(130g)"
        },
        {
            "name" : "양파",
            "quantity": "1/2개"
        },
        {
            "name" : "느타리버섯",
            "quantity": "1컵(80g)"
        },
        {
            "name" : "대파",
            "quantity": "2/3컵(60g)"
        },
        {
            "name" : "청양고추",
            "quantity": "2개(14g)"
        },
        {
            "name" : "홍고추",  
            "quantity": "1/2개(7g)"
        },
        {
            "name" : "두무",
            "quantity": "1/2모(180g)"
        }
    ],
    "cooking_tips" : [
        "쌀뜨물을 활용하면 맛이 더 좋습니다.",  
        "멸치 대신 소고기나 돼지고기를 활용하여 육수를 우려도 됩니다."
    ],
    "cooking_sequence" : {
        "육수 만들기" : {
            "sequence": [
                "멸치의 머리, 내장, 가시를 제거한 뒤 3등분하여 냄비에 넣습니다.",
                "물 4컵을 넣고 끓여줍니다."  
            ],
            "timestamp": 103
        },
        "재료 손질" : {
            "sequence": [
                "느타리 버섯을 일정한 두께로 찢어서 준비하고, 양파와 호박을 깍둑 썰어줍니다.",
                "고추, 파, 두부도 적당한 크기로 썰어줍니다."
            ],
            "timestamp": 254
        },
        "재료 넣기" : {
            "sequence": [
                "양파를 먼저 넣고, 버섯, 호박 순서로 넣어줍니다.",
                "간마늘을 넣어주고 된장도 넣어서 풀어줍니다.",
                "고추, 파를 넣어준 뒤, 두부도 마저 넣어 마무리합니다."
            ],
            "timestamp": 364
        }
    }
}
"""

data_url["알리오 올리오"] = "https://www.youtube.com/watch?v=ohihzV6Z85k"
correct_answer["알리오 올리오"] = """
{
    "title" : "알리오 올리오",
    "cooking_info" : {
        "cooking_time" : "25분",
        "kcal" : 630
    },
    "ingredients" : [
        {
            "name" : "물",
            "quantity": "6컵(1L)"
        },
        {
            "name" : "파스타면",
            "quantity": "100g"
        },
        {
            "name" : "소금",
            "quantity": "1/3큰술(4g)"
        },
        {
            "name" : "올리브유",
            "quantity": "1/3컵(55g)"
        },
        {
            "name" : "간마늘",
            "quantity": "2큰술(40g)"
        },
        {
            "name" : "통마늘",
            "quantity": "4개(21g)"
        },
        {
            "name" : "쪽파",
            "quantity": "4g"
        },
        {
            "name" : "페퍼론치노",
            "quantity": "5개(2g)"
        },
        {
            "name" : "파마산치즈가루",
            "quantity": "약간"
        }
    ],
    "cooking_tips" : [
        "파스타 끓일 물은 라면 1인분의 2배로 잡아주면 편합니다.",
        "기름에 마늘 향이 베일 수 있도록 약한 불에 최대한 볶아줍니다."
    ],
    "cooking_sequence" : {
        "파스타 면 삶기" : {
            "sequence": [
                "물 1L를 넣고 소금을 넣어줍니다.",
                "물이 끓어오르면 파스타 면을 8분간 삶아줍니다.",
                "파스타 면이 타지 않도록 냄비 안쪽으로 넣어줍니다."
            ],
            "timestamp": 240
        },
        "재료 손질 및 볶기" : {
            "sequence": [
                "마늘을 편으로 썰어줍니다.",
                "불을 약하게 켜고 팬에 올리브유를 둘러준 뒤, 편마늘을 볶아줍니다.",
                "마늘이 어느정도 익었다면, 페퍼론치노를 빻아서 넣어줍니다.",
                "편마늘이 어느정도 노릇해졌으면, 간마늘을 넣고 노릇해질때까지 볶아줍니다."
            ],
            "timestamp": 359
        },
        "파스타 면 볶기" : {
            "sequence": [
                "파스타 면이 모두 삶아졌다면, 팬으로 옮겨 재료들과 함께 섞어줍니다.",
                "팬에 물기가 별로 없다면 면수를 추가해줍니다."
            ],
            "timestamp": 488
        },
        "마무리 및 플레이팅": {
            "sequence": [
                "젓가락이나 집게를 활용해서 접시에 잘 옮겨줍니다.",
                "파마산 치즈가루를 뿌려 마무리합니다."
            ],
            "timestamp": 580
        }
    }
}
"""

#  Mid Quality : Manually Script + No Video Description

data_url["소고기 볶음"] = "https://www.youtube.com/watch?v=2ulwxhGy6Rk"
correct_answer["소고기 볶음"] = """
{
    "title" : "소고기 볶음",
    "cooking_info" : {
        "cooking_time" : "25분",
        "kcal" : 630,
    },
    "ingredients" : [
        {
            "name" : "물",
            "quantity": "6컵(1L)"
        },
        {
            "name" : "파스타면",
            "quantity": "100g"
        },
        {
            "name" : "소금",
            "quantity": "1/3큰술(4g)"
        },
        {
            "name" : "올리브유",
            "quantity": "1/3컵(55g)"
        },
        {
            "name" : "간마늘",
            "quantity": "2큰술(40g)"
        },
        {
            "name" : "통마늘",
            "quantity": "4개(21g)"
        },
        {
            "name" : "쪽파",
            "quantity": "4g"
        },
        {
            "name" : "페퍼론치노",
            "quantity": "5개(2g)"
        },
        {
            "name" : "파마산치즈가루",
            "quantity": "약간"
        },
    ],
    "cooking_tips" : [
        "파스타 끓일 물은 라면 1인분의 2배로 잡아주면 편합니다.",
        "기름에 마늘 향이 베일 수 있도록 약한 불에 최대한 볶아줍니다.",
    ],
    "cooking_sequence" : {
        "파스타 면 삶기" : {
            "sequence": [
                "물 1L를 넣고 소금을 넣어줍니다.",
                "물이 끓어오르면 파스타 면을 8분간 삶아줍니다.",
                "파스타 면이 타지 않도록 냄비 안쪽으로 넣어줍니다."
            ],
            "timestamp": 240,
        },
        "재료 손질 및 볶기" : {
            "sequence": [
                "마늘을 편으로 썰어줍니다.",
                "불을 약하게 켜고 팬에 올리브유를 둘러준 뒤, 편마늘을 볶아줍니다.",
                "마늘이 어느정도 익었다면, 페퍼론치노를 빻아서 넣어줍니다.",
                "편마늘이 어느정도 노릇해졌으면, 간마늘을 넣고 노릇해질때까지 볶아줍니다."
            ],
            "timestamp": 359,
        },
        "파스타 면 볶기" : {
            "sequence": [
                "파스타 면이 모두 삶아졌다면, 팬으로 옮겨 재료들과 함께 섞어줍니다.",
                "팬에 물기가 별로 없다면 면수를 추가해줍니다.",
            ],
            "timestamp": 488,
        },
        "마무리 및 플레이팅": {
            "sequence": [
                "젓가락이나 집게를 활용해서 접시에 잘 옮겨줍니다.",
                "파마산 치즈가루를 뿌려 마무리합니다.",
            ],
            "timestamp": 580,
        }
    }
}
"""
