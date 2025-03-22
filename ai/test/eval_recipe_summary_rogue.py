from rouge_score import rouge_scorer
from test.utils.recipe_summary_correct_answer import correct_answer, data_url
from app.services.recipe_summary import RecipeSummary
import asyncio
import json


def parse_video_id(data: str):
    return data.split("v=")[1].split("&")[0]


def json_to_text(json_data):
    text = json_data['title'] + " "
    text += " ".join([ing['name'] + " " + ing['quantity']
                     for ing in json_data['ingredients']]) + " "
    text += " ".join(json_data['cooking_tips']) + " "
    for step in json_data['cooking_sequence'].values():
        text += " ".join(step['sequence']) + " "
    return text.strip()


if __name__ == "__main__":
    MENU_NAME = "알리오 올리오"

    async def main():
        recipe_summary = RecipeSummary()
        api_answer = await recipe_summary.summarize_recipe(parse_video_id(data_url[MENU_NAME]))

        answer_text = json_to_text(json.loads(correct_answer[MENU_NAME]))
        generated_text = json_to_text(api_answer)

        scorer = rouge_scorer.RougeScorer(
            ['rouge1', 'rouge2', 'rougeL'], use_stemmer=False)

        scores = scorer.score(answer_text, generated_text)

        for key in scores:
            print(f"{key}: {scores[key].fmeasure:.4f}")

    asyncio.run(main())
