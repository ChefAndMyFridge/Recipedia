package com.recipidia.ingredient.dto;

import com.recipidia.ingredient.entity.IngredientInfo;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.Value;

/**
 * DTO for {@link com.recipidia.ingredient.entity.IngredientInfo}
 */
@Value
public class IngredientInfoDto implements Serializable {

  @NotNull
  Long id;
  @NotNull
  String name;
  String imageUrl;
  List<IngredientDto> ingredients = new ArrayList<>();

  public static IngredientInfoDto fromEntity(IngredientInfo ingredientInfo) {
    IngredientInfoDto ingredientInfoDto = new IngredientInfoDto(
        ingredientInfo.getId(),
        ingredientInfo.getName(),
        ingredientInfo.getImageUrl()
    );
    ingredientInfoDto.ingredients.addAll(IngredientDto.fromEntity(ingredientInfo.getIngredients()));
    return ingredientInfoDto;
  }
}