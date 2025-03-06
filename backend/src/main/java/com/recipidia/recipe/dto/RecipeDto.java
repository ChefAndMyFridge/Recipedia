package com.recipidia.recipe.dto;

import com.recipidia.recipe.entity.Recipe;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO for {@link Recipe}
 */
public record RecipeDto(Long id, String name, String youtubeUrl,
                        String textRecipe, List<RecipeIngredientDto> ingredients) implements
        Serializable {

    public static RecipeDto fromEntity(Recipe recipe) {
        List<RecipeIngredientDto> ingredientDtos = recipe.getIngredients().stream()
                .map(RecipeIngredientDto::fromEntity)
                .collect(Collectors.toList());
        return new RecipeDto(
            recipe.getId(),
            recipe.getName(),
            recipe.getYoutubeUrl(),
            recipe.getTextRecipe(),
            ingredientDtos
        );
    }

}