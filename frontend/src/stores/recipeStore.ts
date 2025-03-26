import { create } from "zustand";
import { RecipeInfo, RecipeList, Video } from "@/types/recipeListTypes";
import { SelectedIngredients } from "@/types/ingredientsTypes";

interface RecipeStore {
  recipeList: RecipeList;
  detailRecipe: RecipeInfo;
  recipeSelectedIngredients: SelectedIngredients[];
  setRecipeList: (recipeList: RecipeList) => void;
  setDetailRecipe: (detailRecipe: RecipeInfo) => void;
  setRecipeSelectedIngredients: (recipeSelectedIngredients: SelectedIngredients[]) => void;
  //recipeId를 통해 레시피 리스트 내 영상 정보 조회
  findRecipeVideo: (recipeList: RecipeList, recipeId: number) => Video;
}

const useRecipeStore = create<RecipeStore>((set) => ({
  recipeList: { dishes: [], videos: {} },
  detailRecipe: {
    title: "",
    cooking_info: {
      cooking_time: "",
      kcal: 0,
    },
    ingredients: [{ name: "", quantity: "" }],
    cooking_tips: [],
    cooking_sequence: {},
  },
  recipeSelectedIngredients: [],

  setRecipeList: (recipeList: RecipeList) => set({ recipeList }),
  setDetailRecipe: (detailRecipe: RecipeInfo) => set({ detailRecipe }),
  setRecipeSelectedIngredients: (recipeSelectedIngredients: SelectedIngredients[]) =>
    set({ recipeSelectedIngredients }),
  findRecipeVideo: (recipeList: RecipeList, recipeId: number): Video => {
    const video = Object.values(recipeList.videos)
      .flat()
      .find((recipe) => {
        return recipe.recipeId === recipeId;
      });

    if (!video) {
      throw new Error("레시피 비디오를 찾지 못했습니다.");
    }

    return video;
  },
}));

export default useRecipeStore;
