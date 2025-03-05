//mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { INGREDIENTS } from "../data/INGREDIENTS";
const { VITE_API_URL } = import.meta.env;

const handlers = [
  //그룹 목록 조회
  http.get(VITE_API_URL + "/v1/ingredient", () => {
    return HttpResponse.json(INGREDIENTS);
  }),
];

export default handlers;
