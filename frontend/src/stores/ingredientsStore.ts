import { create } from "zustand";
import ALL_INGREDIENTS from "@/data/ALL_INGREDIENTS.ts";

interface IngredientsState {
  // ingredients: 조회된 재료 목록, selectedIngredients: 선택된 재료 목록
  ingredients: IngredientCategory[];
  setIngredients: (ingredients: IngredientCategory[]) => void;
  selectedIngredients: Record<number, SelectedIngredientInfo>; // { ingredientInfoId: selectedCount }
  setSelectedCount: (ingredientInfoId: number, ingredientInfo: SelectedIngredientInfo) => void;
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

interface SelectedIngredientInfo {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  selectedCount: number;
}

const useIngredientsStore = create<IngredientsState>((set) => ({
  ingredients: [...ALL_INGREDIENTS],
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
}));

export default useIngredientsStore;
