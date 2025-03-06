package com.recipidia.recipe.dto;

import com.recipidia.recipe.entity.RecipeIngredient;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link RecipeIngredient}
 */
public record RecipeIngredientDto(Long id, Long recipeId, String name, String quantity) implements
    Serializable {

    public static RecipeIngredientDto fromEntity(RecipeIngredient recipeIngredient) {
        return new RecipeIngredientDto(
            recipeIngredient.getId(),
            recipeIngredient.getRecipe() != null ? recipeIngredient.getRecipe().getId() : null,
            recipeIngredient.getName(),
            recipeIngredient.getQuantity()
        );
    }

    public static List<RecipeIngredientDto> fromEntity(List<RecipeIngredient> ingredients) {
        return ingredients.stream().map(RecipeIngredientDto::fromEntity).toList();
    }
}