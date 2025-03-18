//mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { INGREDIENTS } from "@/data/INGREDIENTS";
import { INGREDIENT_WITH_NUTRITIONS } from "@/data/NUTRITIONS";
import RECIPE_LIST from "@/data/RECIPE_LIST";
import DETAIL_RECIPE from "@/data/DETAIL_RECIPE";

const { VITE_API_URL } = import.meta.env;

const handlers = [
  //재료 목록 조회
  http.get(VITE_API_URL + "/v1/ingredient", () => {
    return HttpResponse.json(INGREDIENTS);
  }),

  // 재료 입고
  http.post(VITE_API_URL + "/v1/ingredient", () => {
    return HttpResponse.json({ message: "재료가 성공적으로 입고되었습니다." });
  }),

  // 재료 상세 조회
  http.get(VITE_API_URL + "/v1/ingredient/nutrient/:ingredientId", () => {
    return HttpResponse.json(INGREDIENT_WITH_NUTRITIONS);
  }),

  //레시피 목록 조회
  http.post(VITE_API_URL + "/v1/recipe", () => {
    return HttpResponse.json(RECIPE_LIST);
  }),

  //레시피 추출
  http.get(VITE_API_URL + "/v1/recipe/:recipeId", () => {
    return HttpResponse.json(DETAIL_RECIPE);
  }),
];

export default handlers;
