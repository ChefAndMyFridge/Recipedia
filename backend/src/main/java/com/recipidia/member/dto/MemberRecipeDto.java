package com.recipidia.member.dto;

import com.recipidia.member.entity.MemberRecipe;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link MemberRecipe}
 */
public record MemberRecipeDto(Long userRecipeId, Long userId, Long recipeId,
                              Integer rating, Boolean favorite, LocalDateTime createdAt)
    implements Serializable {

  public static MemberRecipeDto fromEntity(MemberRecipe memberRecipe) {
    return new MemberRecipeDto(
        memberRecipe.getId(),
        memberRecipe.getMember().getId(),
        memberRecipe.getRecipe().getId(),
        memberRecipe.getRating(),
        memberRecipe.getFavorite(),
        memberRecipe.getCreatedAt()
    );
  }
}
