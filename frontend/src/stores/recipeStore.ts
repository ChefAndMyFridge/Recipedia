import { create } from "zustand";
import { RecipeList } from "@/types/recipeListTypes";

interface RecipeStore {
  recipeList: RecipeList;
  setRecipeList: (recipeList: RecipeList) => void;
}

const recipeStore = create<RecipeStore>((set) => ({
  recipeList: { dishes: [], videos: {} },
  setRecipeList: (recipeList: RecipeList) => set({ recipeList }),
}));

export default recipeStore;
