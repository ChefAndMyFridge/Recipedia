package com.recipidia.recipe.response;

import com.recipidia.recipe.dto.CookingInfo;
import com.recipidia.recipe.dto.CookingStep;
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
  private List<IngredientQueryRes> ingredients;
  private List<String> cooking_tips;
  private Map<String, CookingStep> cooking_sequence;
}