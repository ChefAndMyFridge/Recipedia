import {
  Ingredients,
  // IngredientsInfo,
  StoreIngredient,
  StoreResponseIngredient,
  IngredientNutrition,
  DeleteIngredient,
  DeleteIngredientResponse,
} from "@/types/ingredientsTypes";

import instance from "./instance";

// 고내에 저장된 재료 목록 조회
export const getIngredientsApi = async (): Promise<Ingredients[]> => {
  try {
    const response = await instance.get("v1/ingredient");
    console.log("v1/ingredient", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 전체 재료 목록 조회 (아직 릴리즈되지 않은 API)
export const getIngredientsInfoApi = async (): Promise<Ingredients[]> => {
  try {
    // -----> 임시로 (릴리즈 되지 않아서 ㅜ /info 붙여야됨, 타입도 ingredientsInfo로 바꿔야됨)
    const response = await instance.get("v1/ingredient");
    console.log("v1/ingredient/info", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 입고
export const storeIngredientApi = async (ingredient: StoreIngredient): Promise<StoreResponseIngredient> => {
  try {
    const response = await instance.post("v1/ingredient", ingredient);
    console.log("v1/ingredient (post)", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 상세 조회 (영양 정보)
export const getIngredientNutritionApi = async (ingredientId: number): Promise<IngredientNutrition> => {
  try {
    const response = await instance.get(`v1/ingredient/nutrient/${ingredientId}`);
    console.log("v1/ingredient/nutrient", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 삭제
export const deleteIngredientApi = async (ingredients: DeleteIngredient[]): Promise<DeleteIngredientResponse> => {
  try {
    const response = await instance.delete("v1/ingredient/release", { data: ingredients });
    console.log("v1/ingredient/release", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
