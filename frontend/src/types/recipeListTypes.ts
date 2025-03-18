export interface Video {
  recipeId: number;
  title: string;
  url: string;
  channel_title: string;
  duration: string;
  view_count: number;
  like_count: number;
}

export interface VideoList {
  [dishName: string]: Video[];
}

export interface RecipeList {
  dishes: string[];
  videos: VideoList;
}

export interface RecipeInfo {
  // recipeId: number; //추후 api 구조 변경 시 사용
  title: string;
  cooking_info: {
    cooking_time: string;
    kcal: number;
  };
  ingredients: string[];
  cooking_tools: string[];
  cooking_tips: string[];
  cooking_sequence: {
    [step: string]: string[];
  };
}

//레시피 텍스트 타입
export interface RecipeText {
  [key: string]: string[];
}

export type RecipeInfoKeys = "ingredients" | "cooking_tools" | "cooking_tips";
