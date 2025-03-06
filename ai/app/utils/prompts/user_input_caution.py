# app/utils/prompts/user_input_caution.py
SUMMARY_EXTRA_INPUT = [
    {
        "role" : "user",
        "content" : "요리 구성과 주의할 점을 위에서 설명하고 그 아래에 조리 방법을 순서대로 설명해줘."
    },
    # {
    #     "role" : "user",
    #     "content" : "요리 방법은 최대 7단계 수준으로 나누어서 설명해줘"
    # },
    {
        "role" : "user",
        "content" : "식재료의 양이나 각 순서에 대해서 조리 시간도 상세히 설명하되, 스크립트에서 상세한 설명이 없다면 생략해도 괜찮아."
    },
    # {
    #     "role" : "user",
    #     "content" : "요리 도구들은 정말 옵션인 것만 제외하고 필수로 설정해줘. 가령 김치를 쓴다고 하면 무조건 칼이나 가위가 필요한 것으로 설정하는 거야."
    # },
    {
        "role" : "user",
        "content" : "열량과 소요 시간은 레시피 재료와 조리 순서들을 보고 너가 유추해줘."
    },
    {
        "role" : "user",
        "content" : "내가 원하는 정보들을 key : value 형태로 제공해줘"
    },

]