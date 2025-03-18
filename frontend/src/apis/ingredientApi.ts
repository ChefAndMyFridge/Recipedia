import { Ingredients, StoreIngredient } from "@/types/ingredientsTypes";

import instance from "./instance";

export const getIngredientsApi = async (): Promise<Ingredients[]> => {
  try {
    const response = await instance.get("v1/ingredient");
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

export const storeIngredientApi = async (ingredient: StoreIngredient) => {
  try {
    const response = await instance.post("v1/ingredient", ingredient);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
