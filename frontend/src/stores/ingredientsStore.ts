import { create } from "zustand";

import {
  Ingredients,
  SelectedIngredients,
  filteringInformationKeys,
  filteredInfomations,
} from "@/types/ingredientsTypes.ts";

interface IngredientsState {
  ingredients: Ingredients[] | []; // 고내에 저장된 재료 목록
  selectedIngredients: Record<number, SelectedIngredients>; // { ingredientInfoId: selectedCount } 선택된 재료 목록
  filteringInfomationKeys: filteringInformationKeys;
  filteredInfomations: filteredInfomations;
  setIngredients: (ingredients: Ingredients[]) => void;
  setSelectedCount: (ingredientInfoId: number, ingredientInfo: SelectedIngredients) => void;
  setRemoveSelectedIngredients: (ingredientInfoId: number) => void;
  setClearSelectedIngredients: () => void;
  setInitFilteredInfomations: (filterInfo: filteredInfomations) => void;
  setFilteredInfomations: (filterKey: keyof filteredInfomations, filterValue: string) => void;
  setClearFilteredInfomations: (filterKey: keyof filteredInfomations) => void;
}

const useIngredientsStore = create<IngredientsState>((set) => ({
  ingredients: [],
  selectedIngredients: {},
  filteringInfomationKeys: {
    categories: ["한식", "중식", "일식", "양식"],
    dietaries: ["고단백식", "고열량식", "저염식", "저당식", "저지방식", "저열량식", "비건식", "무가공식", "육식"],
  },
  filteredInfomations: {
    categories: [],
    dietaries: [],
    preferredIngredients: [],
    dislikedIngredients: [],
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
  setInitFilteredInfomations: (filterInfo: filteredInfomations) => {
    set({ filteredInfomations: filterInfo });
  },
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
  setRemoveSelectedIngredients: (ingredientInfoId) =>
    set((state) => {
      const newSelected = { ...state.selectedIngredients };
      delete newSelected[ingredientInfoId];

      return { selectedIngredients: newSelected };
    }),
  setClearFilteredInfomations: (filterKey) =>
    set((state) => {
      return { filteredInfomations: { ...state.filteredInfomations, [filterKey]: [] } };
    }),
}));

export default useIngredientsStore;
