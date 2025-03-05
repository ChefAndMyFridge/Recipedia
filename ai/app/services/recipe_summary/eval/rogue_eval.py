from rouge_score import rouge_scorer
from dummy_data import *

# ROUGE-1, ROUGE-2, ROUGE-L 평가
scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
scores = scorer.score(reference, generated)

# 결과 출력
print(scores)
