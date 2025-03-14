package com.recipidia.recipe.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class VideoInfoCustomResponse {
  private long recipeId;
  private String title;
  private String url;
  private String channel_title;
  private String duration;
  private long view_count;
  private long like_count;
}
