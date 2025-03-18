//mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { INGREDIENTS } from "@/data/INGREDIENTS";
import RECIPE_LIST from "@/data/RECIPE_LIST";
const { VITE_API_URL } = import.meta.env;

const handlers = [
  //그룹 목록 조회
  http.get(VITE_API_URL + "/v1/ingredient", () => {
    return HttpResponse.json(INGREDIENTS);
  }),

  // //레시피 목록 조회
  // http.post(VITE_API_URL + "/v1/recipe", () => {
  //   return HttpResponse.json(RECIPE_LIST);
  // }),

  //레시피 추출
  http.get(VITE_API_URL + "/v1/recipe/:recipeId", () => {
    return HttpResponse.json(RECIPE_LIST);
  }),
];

export default handlers;
