# app/utils/prompts/user_input_caution.py
SUMMARY_EXTRA_INPUT = [
    {
        "role" : "user",
        "content" : "요리 구성과 주의할 점을 위에서 설명하고 그 아래에 조리 방법을 순서대로 설명해줘."
    },
    {
        "role" : "user",
        "content" : "식재료의 양이나 각 순서에 대해서 조리 시간도 상세히 설명하되, 스크립트에서 상세한 설명이 없다면 생략해도 괜찮아."
    },
    {
        "role" : "user",
        "content" : "식재료의 양을 설명해줄 때에는, 가능하다면 중량 말고 개수도 포함해줘."
    },
    {
        "role" : "user",
        "content" : "식재료의 경우 범용적인 단어를 선택해줘. 가령, '소고기(양지 또는 사태)'로 표기하지 않고 '소고기'로 표기해줘."
    },
    {
        "role" : "user",
        "content" : "열량과 소요 시간은 레시피 재료와 조리 순서들을 보고 너가 유추해줘."
    },
    {
        "role" : "user",
        "content" : "내가 원하는 정보들을 key : value 형태로 제공해줘"
    },

]