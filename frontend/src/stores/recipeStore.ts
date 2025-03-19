import { create } from "zustand";
import { RecipeInfo, RecipeList, Video } from "@/types/recipeListTypes";

interface RecipeStore {
  recipeList: RecipeList;
  setRecipeList: (recipeList: RecipeList) => void;
  detailRecipe: RecipeInfo;
  setDetailRecipe: (detailRecipe: RecipeInfo) => void;
  //recipeId를 통해 레시피 리스트 내 영상 정보 조회
  findRecipeVideo: (recipeList: RecipeList, recipeId: number) => Video;
}

const recipeStore = create<RecipeStore>((set) => ({
  recipeList: { dishes: [], videos: {} },
  detailRecipe: {
    title: "",
    cooking_info: {
      cooking_time: "",
      kcal: 0,
    },
    ingredients: [],
    cooking_tools: [],
    cooking_tips: [],
    cooking_sequence: {},
  },
  setRecipeList: (recipeList: RecipeList) => set({ recipeList }),
  setDetailRecipe: (detailRecipe: RecipeInfo) => set({ detailRecipe }),
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

export default recipeStore;
