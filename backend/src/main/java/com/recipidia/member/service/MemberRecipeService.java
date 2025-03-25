package com.recipidia.member.service;

import com.recipidia.member.dto.MemberRecipeDto;
import com.recipidia.member.dto.RecipeWithMemberInfoDto;

import java.util.List;

public interface MemberRecipeService {
  MemberRecipeDto patchMemberRecipe(Long memberId, Long recipeId, Integer rating, Boolean favorite);
  List<MemberRecipeDto> getMemberRecipes(Long memberId);
  List<RecipeWithMemberInfoDto> getMemberFavorites(Long memberId);
  List<RecipeWithMemberInfoDto> getMemberRatedRecipes(Long memberId);


}
