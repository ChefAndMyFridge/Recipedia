package com.recipidia.recipe.dto;

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
public class VideoInfo {
  private String title;
  private String url;
  private String channel_title;
  private String duration;
  private Long view_count;
  private Long like_count;
  private Boolean has_caption;
}