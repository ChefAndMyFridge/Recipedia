import { create } from "zustand";
import { RecipeInfo, RecipeList } from "@/types/recipeListTypes";
import { SelectedIngredients } from "@/types/ingredientsTypes";

import { devtools } from "zustand/middleware";

interface RecipeStore {
  recipeList: RecipeList;
  detailRecipe: RecipeInfo;
  recipeSelectedIngredients: SelectedIngredients[];
  setRecipeList: (recipeList: RecipeList) => void;
  setDetailRecipe: (detailRecipe: RecipeInfo) => void;
  setRecipeSelectedIngredients: (recipeSelectedIngredients: SelectedIngredients[]) => void;
  resetRecipeList: () => void;
  resetDetailRecipe: () => void;
  resetRecipeSelectedIngredients: () => void;
  hasFetchedDetailRecipe: boolean;
  setHasFetchedDetailRecipe: (fetched: boolean) => void;
}

const useRecipeStore = create<RecipeStore>()(
  devtools((set) => ({
    recipeList: { dishes: [], videos: {} },
    detailRecipe: {
      recipeId: 0,
      name: "",
      title: "",
      url: "",
      channelTitle: "",
      duration: "",
      viewCount: 0,
      likeCount: 0,
      textRecipe: null,
    },
    recipeSelectedIngredients: [],

    setRecipeList: (recipeList: RecipeList) => set({ recipeList }),
    setDetailRecipe: (detailRecipe: RecipeInfo) => set({ detailRecipe }),
    setRecipeSelectedIngredients: (recipeSelectedIngredients: SelectedIngredients[]) =>
      set({ recipeSelectedIngredients }),
    resetRecipeList: () => set({ recipeList: { dishes: [], videos: {} } }),
    resetDetailRecipe: () =>
      set({
        detailRecipe: {
          recipeId: 0,
          name: "",
          title: "",
          url: "",
          channelTitle: "",
          duration: "",
          viewCount: 0,
          likeCount: 0,
          textRecipe: null,
        },
      }),
    resetRecipeSelectedIngredients: () => set({ recipeSelectedIngredients: [] }),
    hasFetchedDetailRecipe: false,
    setHasFetchedDetailRecipe: (fetched: boolean) => set({ hasFetchedDetailRecipe: fetched }),
  }))
);

export default useRecipeStore;
