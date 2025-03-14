import { create } from "zustand";

import { INGREDIENTS } from "@/data/INGREDIENTS.ts";

import { Ingredients, SelectedIngredients, filteredInfomations } from "@/types/ingredientsTypes.ts";

interface IngredientsState {
  // ingredients: 조회된 재료 목록, selectedIngredients: 선택된 재료 목록
  ingredients: Ingredients[];
  selectedIngredients: Record<number, SelectedIngredients>; // { ingredientInfoId: selectedCount }
  filteredInfomations: filteredInfomations;
  setIngredients: (ingredients: Ingredients[]) => void;
  setSelectedCount: (ingredientInfoId: number, ingredientInfo: SelectedIngredients) => void;
  setClearSelectedIngredients: () => void;
  setFilteredInfomations: (filterKey: keyof filteredInfomations, filterValue: string) => void;
}

const useIngredientsStore = create<IngredientsState>((set) => ({
  ingredients: [...INGREDIENTS],
  selectedIngredients: {},
  filteredInfomations: {
    type: [],
    preference: [],
    dislike: [],
  },
  setIngredients: (ingredients) => set({ ingredients }),
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
  setFilteredInfomations: (filterKey, filterValue) => {
    set((state) => {
      const newSelected = { ...state.filteredInfomations };

      if (newSelected[filterKey].includes(filterValue)) {
        newSelected[filterKey] = newSelected[filterKey].filter((item) => item !== filterValue);
      } else {
        newSelected[filterKey] = [...newSelected[filterKey], filterValue];
      }

      return { filteredInfomations: newSelected };
    });
  },
}));

export default useIngredientsStore;
