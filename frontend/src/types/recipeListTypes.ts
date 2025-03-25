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

export interface RecipeInfo {
  title: string;
  cooking_info: {
    cooking_time: string;
    kcal: number;
  };
  ingredients: recipeIngredientsInfo[];
  cooking_tips: string[];
  cooking_sequence: recipeCookingSequenceInfo;
}

export type RecipeInfoKeys = "ingredients" | "cooking_tips";
