import { create } from "zustand";

import { INGREDIENTS } from "@/data/INGREDIENTS.ts";

import { Ingredients, SelectedIngredients, filteredInfomations } from "@/types/ingredientsTypes.ts";

interface IngredientsState {
  ingredients: Ingredients[]; // 고내에 저장된 재료 목록
  ingredientsInfo: Ingredients[]; // 전체 재료 목록 (검색 시 자동 완성에 사용)
  selectedIngredients: Record<number, SelectedIngredients>; // { ingredientInfoId: selectedCount } 선택된 재료 목록
  filteringInfomationKeys: filteredInfomations;
  filteredInfomations: filteredInfomations;
  setIngredients: (ingredients: Ingredients[]) => void;
  setIngredientsInfo: (ingredientsInfo: Ingredients[]) => void;
  setSelectedCount: (ingredientInfoId: number, ingredientInfo: SelectedIngredients) => void;
  setClearSelectedIngredients: () => void;
  setFilteredInfomations: (filterKey: keyof filteredInfomations, filterValue: string) => void;
  setClearFilteredInfomations: (filterKey: keyof filteredInfomations) => void;
}

const useIngredientsStore = create<IngredientsState>((set) => ({
  ingredients: [],
  ingredientsInfo: [...INGREDIENTS],
  selectedIngredients: {}, //
  filteringInfomationKeys: {
    type: ["한식", "중식", "일식", "양식"],
    preference: ["고단백식", "고열량식", "저염식", "저당식", "저지방식", "저열량식", "비건식", "무가공식", "육식"],
    dislike: ["고단백식", "고열량식", "저염식", "저당식", "저지방식", "저열량식", "비건식", "무가공식", "육식"],
  },
  filteredInfomations: {
    type: [],
    preference: [],
    dislike: [],
  },
  setIngredients: (ingredients) => set({ ingredients }),
  setIngredientsInfo: (ingredientsInfo) => set({ ingredientsInfo }),
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
  setClearFilteredInfomations: (filterKey) =>
    set((state) => {
      return { filteredInfomations: { ...state.filteredInfomations, [filterKey]: [] } };
    }),
}));

export default useIngredientsStore;
