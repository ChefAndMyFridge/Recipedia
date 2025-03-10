export interface Video {
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

export type RecipeInfoKeys = "ingredients" | "cooking_tools" | "cooking_tips";
