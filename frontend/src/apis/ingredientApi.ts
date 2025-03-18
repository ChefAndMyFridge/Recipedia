import { Ingredients } from "@/types/ingredientsTypes";

import instance from "./instance";

export const getIngredients = async (): Promise<Ingredients[]> => {
  try {
    const response = await instance.get("v1/ingredient");
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
