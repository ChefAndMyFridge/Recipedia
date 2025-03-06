package com.recipidia.recipe.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeQueryRes {

  private List<String> dishes;
  private Map<String, List<VideoInfo>> videos;
  private double execution_time; // 선택 사항
}