package com.recipidia.ingredient.dto;

import com.recipidia.ingredient.entity.IngredientInfo;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for {@link IngredientInfo}
 */
@Getter
@NoArgsConstructor
public class IngredientSimpleInfoDto implements Serializable {

  private Long ingredientInfoId;
  private String name;
  private String imageUrl;
  private int totalCount;

  public IngredientSimpleInfoDto(Long ingredientInfoId, String name, String imageUrl, int totalCount) {
    this.ingredientInfoId = ingredientInfoId;
    this.name = name;
    this.imageUrl = imageUrl;
    this.totalCount = totalCount;
  }

  public static IngredientSimpleInfoDto fromEntity(IngredientInfo ingredientInfo) {
    // 출고되지 않은(released가 false) 재료만 카운트
    int count = (int) ingredientInfo.getIngredients().stream()
        .filter(ingredient -> !ingredient.isReleased())
        .count();
    return new IngredientSimpleInfoDto(
        ingredientInfo.getId(),
        ingredientInfo.getName(),
        ingredientInfo.getImageUrl(),
        count
    );
  }
}