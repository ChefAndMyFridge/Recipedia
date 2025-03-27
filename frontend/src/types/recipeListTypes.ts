export interface Video {
  recipeId: number;
  title: string;
  url: string;
  channelTitle: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  favorite: boolean;
  rating: number;
}

export interface VideoList {
  [dishName: string]: Video[];
}

export interface RecipeList {
  dishes: string[];
  videos: VideoList;
}

export interface recipeIngredientsInfo {
  name: string;
  quantity: string;
}

export interface recipeCookingSequenceInfo {
  [step: string]: {
    sequence: string[];
    timestamp: number;
  };
}

export interface textRecipeType {
  title: string | null;
  cooking_info: {
    cooking_time: string;
    kcal: number;
  } | null;
  ingredients: recipeIngredientsInfo[] | null;
  cooking_tips: string[] | null;
  cooking_sequence: recipeCookingSequenceInfo | null;
}

export interface RecipeInfo {
  recipeId: number;
  name: string;
  title: string;
  url: string;
  channelTitle: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  textRecipe: textRecipeType | null;
}

export type RecipeInfoKeys = "video_infos" | "cooking_sequence" | "ingredients" | "cooking_tips";
