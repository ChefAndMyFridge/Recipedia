import { RecipeList, Video } from "@/types/recipeListTypes";
import instance from "./instance";

//재료 기반 요리이름 생성 및 레시피 리스트 조회 API
export const makeRecipeApi = async (ingredients: string[]): Promise<RecipeList> => {
  try {
    const response = await instance.post("/v1/recipe", {
      ingredients: ingredients,
    });

    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

//레시피 추출 API
export const getRecipeDetailApi = async (recipeId: number) => {
  try {
    const response = await instance.get(`/v1/recipe/${recipeId}`);
    return response.data;
  } catch (error: unknown) {
    console.log("레시피 추출 에러", error);
    throw new Error(error as string);
  }
};

//레시피 평가 및 즐겨찾기 API
export const patchRecipeApi = async (memberId: number, recipeId: number, rating?: number, favorite?: boolean) => {
  const reqBody =
    rating === 0
      ? {
          memberId: memberId,
          favorite: favorite,
        }
      : {
          memberId: memberId,
          rating: rating,
        };
  try {
    const response = await instance.patch(`/v1/member/recipe/${recipeId}`, reqBody);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

//사용자가 별점을 준 레시피 (과거) 조회 API
export const getRecipeRatingApi = async (memberId: number): Promise<Video[]> => {
  try {
    const response = await instance.get(`/v1/member/recipe/${memberId}/ratings`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

//사용자가 즐겨찾기 한 레시피 조회 API
export const getRecipeFavoriteApi = async (memberId: number): Promise<Video[]> => {
  try {
    const response = await instance.get(`/v1/member/recipe/${memberId}/favorites`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
