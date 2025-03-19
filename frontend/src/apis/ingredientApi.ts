import {
  Ingredients,
  IngredientsInfo,
  StoreIngredient,
  StoreResponseIngredient,
  IngredientNutrition,
} from "@/types/ingredientsTypes";

import instance from "./instance";

// 고내에 저장된 재료 목록 조회
export const getIngredientsApi = async (): Promise<Ingredients[]> => {
  try {
    const response = await instance.get("v1/ingredient");
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 전체 재료 목록 조회 (아직 릴리즈되지 않은 API)
export const getIngredientsInfoApi = async (): Promise<IngredientsInfo[]> => {
  try {
    const response = await instance.get("v1/ingredient/info");
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 입고
export const storeIngredientApi = async (ingredient: StoreIngredient): Promise<StoreResponseIngredient> => {
  try {
    const response = await instance.post("v1/ingredient", ingredient);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 상세 조회 (영양 정보)
export const getIngredientNutritionApi = async (ingredientId: number): Promise<IngredientNutrition> => {
  try {
    const response = await instance.get(`v1/ingredient/nutrient/${ingredientId}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
