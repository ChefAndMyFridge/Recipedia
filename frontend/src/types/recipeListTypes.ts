export interface Video {
  title: string;
  url: string;
  relevance_score: number;
}

export interface VideoList {
  [dishName: string]: Video[];
}

export interface RecipeList {
  dishes: string[];
  videos: VideoList;
}
