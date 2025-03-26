import { create } from "zustand";
import { RecipeInfo, RecipeList } from "@/types/recipeListTypes";
import { SelectedIngredients } from "@/types/ingredientsTypes";

interface RecipeStore {
  recipeList: RecipeList;
  detailRecipe: RecipeInfo;
  recipeSelectedIngredients: SelectedIngredients[];
  setRecipeList: (recipeList: RecipeList) => void;
  setDetailRecipe: (detailRecipe: RecipeInfo) => void;
  setRecipeSelectedIngredients: (recipeSelectedIngredients: SelectedIngredients[]) => void;
}

const useRecipeStore = create<RecipeStore>((set) => ({
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
    textRecipe: {
      title: "",
      cooking_info: {
        cooking_time: "",
        kcal: 0,
      },
      ingredients: [],
      cooking_tips: [],
      cooking_sequence: {},
    },
  },
  recipeSelectedIngredients: [],

  setRecipeList: (recipeList: RecipeList) => set({ recipeList }),
  setDetailRecipe: (detailRecipe: RecipeInfo) => set({ detailRecipe }),
  setRecipeSelectedIngredients: (recipeSelectedIngredients: SelectedIngredients[]) =>
    set({ recipeSelectedIngredients }),
}));

export default useRecipeStore;
