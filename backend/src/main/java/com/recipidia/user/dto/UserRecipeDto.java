package com.recipidia.user.dto;

import com.recipidia.user.entity.UserRecipe;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link UserRecipe}
 */
public record UserRecipeDto(Long userRecipeId, Long userId, Long recipeId,
                            Integer rating, Boolean favorite, LocalDateTime createdAt)
    implements Serializable {

  public static UserRecipeDto fromEntity(UserRecipe userRecipe) {
    return new UserRecipeDto(
        userRecipe.getId(),
        userRecipe.getUser().getId(),
        userRecipe.getRecipe().getId(),
        userRecipe.getRating(),
        userRecipe.getFavorite(),
        userRecipe.getCreatedAt()
    );
  }
}
