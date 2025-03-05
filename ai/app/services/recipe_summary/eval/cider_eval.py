from pycocoevalcap.cider.cider import Cider

# 참조 요약문 (정답)
references = {
    "1": ["이것은 자연어 처리를 위한 예제 문장입니다.", 
          "이 문장은 자연어 처리 테스트를 위한 것입니다."]
}

# 모델이 생성한 요약문 - 참조 요약문과 더 유사하게 수정
hypotheses = {
    "1": ["이것은 자연어 처리를 위한 예제 문장입니다."]  # 리스트가 아닌 문자열로 변경
}

# CIDEr 점수 계산
scorer = Cider()
score, _ = scorer.compute_score(references, hypotheses)

print("CIDEr Score:", score)