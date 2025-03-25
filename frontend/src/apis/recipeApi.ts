import { RecipeList } from "@/types/recipeListTypes";
import instance from "./instance";

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
