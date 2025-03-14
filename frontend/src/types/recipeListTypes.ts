export interface Video {
  recipeId: number;
  title: string;
  url: string;
  description: string;
  channel_title: string;
  published_at: string;
  duration: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  relevance_score: number;
}

export interface VideoList {
  [dishName: string]: Video[];
}

export interface RecipeList {
  dishes: string[];
  videos: VideoList;
}

export interface RecipeInfo {
  recipeId: number;
  title: string;
  cooking_info: {
    cooking_time: string;
    kcal: number;
  };
  ingredients: string[];
  cooking_tools: string[];
  cooking_tips: string[];
  cooking_sequence: {
    [key: string]: string[];
  };
}

//레시피 텍스트 타입
export interface RecipeText {
  [key: string]: string[];
}

export type RecipeInfoKeys = "ingredients" | "cooking_tools" | "cooking_tips";
