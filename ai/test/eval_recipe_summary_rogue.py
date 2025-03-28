from rouge_score import rouge_scorer
from test.utils.recipe_summary_correct_answer import correct_answer, data_url
from app.services.recipe_summary import RecipeSummary
import asyncio
import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os


def parse_video_id(data: str) -> str:
    return data.split("v=")[1].split("&")[0]


def json_to_text(json_data: dict) -> str:
    text = json_data['title'] + " "
    text += " ".join([ing['name'] + " " + ing['quantity']
                     for ing in json_data['ingredients']]) + " "
    text += " ".join(json_data['cooking_tips']) + " "
    for step in json_data['cooking_sequence'].values():
        text += " ".join(step['sequence']) + " "
    return text.strip()


def visualize_rouge_scores(score_dict: dict, model_name: str, save_dir: str = "logs/recipe_summary_eval_results"):
    os.makedirs(save_dir, exist_ok=True)
    keys = list(score_dict.keys())
    scores = [score_dict[k].fmeasure for k in keys]

    plt.figure(figsize=(8, 5))
    plt.bar(keys, scores)
    plt.ylim(0, 1)
    plt.title(f"ROUGE Scores - {model_name}")
    plt.ylabel("F-measure")
    plt.xlabel("ROUGE Type")
    for i, v in enumerate(scores):
        plt.text(i, v + 0.02, f"{v:.4f}", ha='center')
    plt.tight_layout()
    plt.savefig(os.path.join(save_dir, f"{model_name}_rouge_scores.png"))
    plt.show()


def save_scores_to_csv(score_dict: dict, model_name: str, menu_name: str, csv_dir: str = "logs/recipe_summary_eval_results"):
    os.makedirs(csv_dir, exist_ok=True)
    date_str = datetime.now()

    row = {
        "Date": date_str,
        "Menu": menu_name,
        "Model": model_name,
    }

    for k, v in score_dict.items():
        row[f"{k}_P"] = round(v.precision, 4)
        row[f"{k}_R"] = round(v.recall, 4)
        row[f"{k}_F1"] = round(v.fmeasure, 4)

    csv_path = os.path.join(csv_dir, f"{model_name}_rouge_scores.csv")

    # 기존 파일 있으면 이어쓰기, 없으면 새로 만들기
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    else:
        df = pd.DataFrame([row])

    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"📄 Saved ROUGE scores to {csv_path}")


if __name__ == "__main__":
    MENU_NAME = "알리오 올리오"
    MODEL_NAME = "GPT-4"  # 여기에 모델 이름 지정

    async def main():
        recipe_summary = RecipeSummary()
        api_answer = await recipe_summary.summarize_recipe(parse_video_id(data_url[MENU_NAME]))

        answer_text = json_to_text(json.loads(correct_answer[MENU_NAME]))
        generated_text = json_to_text(api_answer)

        scorer = rouge_scorer.RougeScorer(
            ['rouge1', 'rouge2', 'rougeL'], use_stemmer=False)
        scores = scorer.score(answer_text, generated_text)

        # 출력
        for key in scores:
            print(f"{key}: {scores[key].fmeasure:.4f}")

        # 시각화 및 저장
        visualize_rouge_scores(scores, MODEL_NAME)
        save_scores_to_csv(scores, MODEL_NAME, MENU_NAME)

    asyncio.run(main())
