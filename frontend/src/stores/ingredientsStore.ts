import { create } from "zustand";

import ALL_INGREDIENTS from "@/data/ALL_INGREDIENTS.ts";

interface IngredientsState {
  ingredients: IngredientCategory[];
  setIngredients: (ingredients: IngredientCategory[]) => void;
}

interface IngredientCategory {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  totalCount: number;
  ingredients: IngredientItem[];
}

interface IngredientItem {
  ingredientId: number;
  storagePlace: string;
  expirationDate: string;
  incomingDate: string;
  releasingDate: string | null;
}

const useIngredientsStore = create<IngredientsState>((set) => ({
  ingredients: [...ALL_INGREDIENTS],
  setIngredients: (ingredients) => set({ ingredients }),
}));

export default useIngredientsStore;
