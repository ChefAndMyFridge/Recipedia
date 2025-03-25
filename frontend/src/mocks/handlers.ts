//mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { INGREDIENTS, SEARCH_INGREDIENTS_INFO } from "@/data/INGREDIENTS";
import { INGREDIENT_WITH_NUTRITIONS } from "@/data/NUTRITIONS";
import RECIPE_LIST from "@/data/RECIPE_LIST";
import DETAIL_RECIPE from "@/data/DETAIL_RECIPE";

const { VITE_API_URL } = import.meta.env;

const handlers = [
  // 고내에 저장된 재료 목록 조회
  http.get(VITE_API_URL + "/v1/ingredient", () => {
    return HttpResponse.json(INGREDIENTS);
  }),

  // 재료 입고
  http.post(VITE_API_URL + "/v1/ingredient", () => {
    return HttpResponse.json({ message: "재료가 성공적으로 입고되었습니다." });
  }),

  // 재료 자동완성 검색 (안 변하는 게 정상입니다)
  http.get(VITE_API_URL + "/v1/ingredient/search?req=:inputValue", () => {
    return HttpResponse.json(SEARCH_INGREDIENTS_INFO);
  }),

  // 재료 상세 조회
  http.get(VITE_API_URL + "/v1/ingredient/nutrient/:ingredientId", () => {
    return HttpResponse.json(INGREDIENT_WITH_NUTRITIONS);
  }),

  // 재료 삭제
  http.delete(VITE_API_URL + "/v1/ingredient/release", () => {
    return HttpResponse.json({
      사과: 1,
      대파: 1,
    });
  }),

  //레시피 목록 조회
  http.post(VITE_API_URL + "/v1/recipe", () => {
    return HttpResponse.json(RECIPE_LIST);
  }),

  //레시피 추출
  http.get(VITE_API_URL + "/v1/recipe/:recipeId", () => {
    return HttpResponse.json(DETAIL_RECIPE);
  }),

  //사용자 이름 수정
  // http.put(VITE_API_URL + "/v1/member/:id", () => {
  //   return HttpResponse.json({
  //     memberId: 9007199254740991,
  //     membername: "이름 수정",
  //   });
  // }),
];

export default handlers;
