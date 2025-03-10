package com.recipidia.recipe.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeExtractRes {
  private String title;
  private CookingInfo cooking_info;
  private List<String> ingredients;
  private List<String> cooking_tools;
  private List<String> cooking_tips;
  private Map<String, List<String>> cooking_sequence;
}