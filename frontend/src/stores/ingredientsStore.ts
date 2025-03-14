import { create } from "zustand";

import { INGREDIENTS } from "@/data/INGREDIENTS.ts";

import { Ingredients, SelectedIngredients } from "@/types/ingredientsTypes.ts";

interface IngredientsState {
  // ingredients: 조회된 재료 목록, selectedIngredients: 선택된 재료 목록
  ingredients: Ingredients[];
  setIngredients: (ingredients: Ingredients[]) => void;
  selectedIngredients: Record<number, SelectedIngredients>; // { ingredientInfoId: selectedCount }
  setSelectedCount: (ingredientInfoId: number, ingredientInfo: SelectedIngredients) => void;
  setClearSelectedIngredients: () => void;
}

const useIngredientsStore = create<IngredientsState>((set) => ({
  ingredients: [...INGREDIENTS],
  setIngredients: (ingredients) => set({ ingredients }),
  selectedIngredients: {},
  setSelectedCount: (ingredientInfoId, ingredientInfo) => {
    set((state) => {
      const newSelected = { ...state.selectedIngredients };

      if (ingredientInfo.selectedCount > 0) {
        newSelected[ingredientInfoId] = ingredientInfo;
      } else {
        // 0이면 삭제
        delete newSelected[ingredientInfoId];
      }

      return { selectedIngredients: newSelected };
    });
  },
  setClearSelectedIngredients: () => set({ selectedIngredients: {} }),
}));

export default useIngredientsStore;
