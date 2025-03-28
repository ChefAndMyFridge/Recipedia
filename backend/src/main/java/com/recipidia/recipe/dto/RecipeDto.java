package com.recipidia.recipe.dto;

import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.response.RecipeExtractRes;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO for {@link Recipe}
 */
public record RecipeDto(Long recipeId, String name, String title, String youtubeUrl,
                        boolean hasTextRecipe, List<RecipeIngredientDto> ingredients,
                        String channelTitle, String duration, long viewCount,
                        long likeCount, Boolean hasCaption) implements
        Serializable {

    public static RecipeDto fromEntity(Recipe recipe) {
        List<RecipeIngredientDto> ingredientDtos = recipe.getIngredients().stream()
                .map(RecipeIngredientDto::fromEntity)
                .collect(Collectors.toList());
        return new RecipeDto(
            recipe.getId(),
            recipe.getName(),
            recipe.getTitle(),
            recipe.getYoutubeUrl(),
            recipe.getTextRecipe() != null,
            ingredientDtos,
            recipe.getChannelTitle(),
            recipe.getDuration(),
            recipe.getViewCount(),
            recipe.getLikeCount(),
            recipe.getHasCaption()
        );
    }

}