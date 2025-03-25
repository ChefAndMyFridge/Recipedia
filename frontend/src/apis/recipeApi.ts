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
