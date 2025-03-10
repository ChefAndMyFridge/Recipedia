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
