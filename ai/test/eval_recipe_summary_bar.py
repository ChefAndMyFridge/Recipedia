import os
import asyncio
import json
import pandas as pd
import matplotlib.pyplot as plt

from rouge_score import rouge_scorer
from test.utils.recipe_summary_correct_answer import correct_answer, data_url
from test.utils.eval_recipe_summary_common import json_to_text, parse_video_id, MENU_NAME
from app.services.recipe_summary import RecipeSummary
from app.core.config import settings


EVAL_DIR = "logs/recipe_summary_eval_results/bar/"
CSV_DIR = EVAL_DIR + "csv/"
PLOT_DIR = EVAL_DIR + "plot/"
EXP_ENV = "영상 설명, Few Shot, 자막 데이터"


def visualize_rouge_scores_csv():
    csv_path = os.path.join(
        CSV_DIR, f"{MENU_NAME}_{settings.SUMMARY_OPENAI_MODEL}.csv")

    if not os.path.exists(csv_path):
        print(f"CSV 파일이 없습니다: {csv_path}")
        return

    df = pd.read_csv(csv_path)
    x = range(len(df))  # 평가 인덱스

    plt.figure(figsize=(12, 6))

    width = 0.25  # 막대 너비
    rouge_types = ["rouge1", "rouge2", "rougeL"]
    colors = ["skyblue", "salmon", "limegreen"]

    for i, (rouge, color) in enumerate(zip(rouge_types, colors)):
        offsets = [xi + i * width for xi in x]
        plt.bar(offsets, df[f"{rouge}_F1"], width=width,
                label=rouge.upper(), color=color)

    # X축 조정
    center_x = [xi + width for xi in x]  # 가운데 기준선
    if "EXP_ENV" in df.columns:
        x_labels = [str(d)[:20] for d in df["EXP_ENV"]]
        plt.xticks(center_x, x_labels, rotation=0)
    else:
        plt.xticks(center_x, [str(i + 1) for i in x])

    plt.title(
        f"ROUGE F1 Score (Bar Chart) - {settings.SUMMARY_OPENAI_MODEL} - {MENU_NAME}")
    plt.xlabel("Evaluation Environment")
    plt.ylabel("F1 Score")
    plt.ylim(0, 1)
    plt.legend()
    plt.tight_layout()
    plt.grid(axis='y')

    os.makedirs(PLOT_DIR, exist_ok=True)
    save_path = os.path.join(
        PLOT_DIR, f"{MENU_NAME}_{settings.SUMMARY_OPENAI_MODEL}_bar.png")
    plt.savefig(save_path)
    plt.show()
    print(f"Bar chart saved to {save_path}")


def save_scores_to_csv(score_dict: dict):
    os.makedirs(CSV_DIR, exist_ok=True)

    row = {
        "EXP_ENV": EXP_ENV,
        "Menu": MENU_NAME,
        "Model": settings.SUMMARY_OPENAI_MODEL,
    }

    for k, v in score_dict.items():
        row[f"{k}_P"] = round(v.precision, 4)
        row[f"{k}_R"] = round(v.recall, 4)
        row[f"{k}_F1"] = round(v.fmeasure, 4)

    csv_path = os.path.join(
        CSV_DIR, f"{MENU_NAME}_{settings.SUMMARY_OPENAI_MODEL}.csv")

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    else:
        df = pd.DataFrame([row])

    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"📄 Saved ROUGE scores to {csv_path}")


if __name__ == "__main__":
    async def main():
        recipe_summary = RecipeSummary()
        api_answer = await recipe_summary.summarize_recipe(
            parse_video_id(data_url[MENU_NAME]),
            use_description=False,
            use_few_shot=True,
            use_system_input=True
        )

        scorer = rouge_scorer.RougeScorer(
            ['rouge1', 'rouge2', 'rougeL'], use_stemmer=False)
        scores = scorer.score(
            correct_answer[MENU_NAME], json.dumps(api_answer, ensure_ascii=False))

        # 출력
        for key in scores:
            print(f"{key}: {scores[key].fmeasure:.4f}")

        # 시각화 및 저장
        save_scores_to_csv(scores)
        visualize_rouge_scores_csv()

    asyncio.run(main())
