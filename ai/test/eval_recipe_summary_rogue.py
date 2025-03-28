from rouge_score import rouge_scorer
from test.utils.recipe_summary_correct_answer import correct_answer, data_url
from app.services.recipe_summary import RecipeSummary
import asyncio
import json
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import os

MENU_NAME = "알리오 올리오"
MODEL_NAME = "GPT-4"  # 여기에 모델 이름 지정


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


def visualize_rouge_scores_csv(model_name: str, csv_dir: str = "logs/recipe_summary_eval_results"):
    csv_path = f"{csv_dir}/{model_name}_rouge_scores.csv"

    if not os.path.exists(csv_path):
        print(f"CSV 파일이 없습니다: {csv_path}")
        return

    df = pd.read_csv(csv_path)

    # rogue 평가 시도 횟수
    x = range(len(df))

    plt.figure(figsize=(10, 6))

    # 각 ROUGE 종류별 F1 점수 꺾은선 그리기
    rouge_types = ["rouge1", "rouge2", "rougeL"]
    for rouge in rouge_types:
        plt.plot(x, df[f"{rouge}_F1"], label=rouge.upper(), marker="o")

    plt.title(f"ROUGE F1 Score - {model_name} - {MENU_NAME}")
    plt.xlabel("Evaluation Count")
    plt.ylabel("F1 Score")
    plt.ylim(0, 1)
    plt.legend()
    plt.grid(True)
    plt.tight_layout()

    save_path = os.path.join(csv_dir, f"{model_name}_rouge_lineplot.png")
    plt.savefig(save_path)
    plt.show()
    print(f"Line plot saved to {save_path}")


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

    csv_path = f"{csv_dir}/{model_name}_rouge_scores.csv"

    # 기존 파일 있으면 이어쓰기, 없으면 새로 만들기
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
        save_scores_to_csv(scores, MODEL_NAME, MENU_NAME)
        visualize_rouge_scores_csv(MODEL_NAME)

    asyncio.run(main())
