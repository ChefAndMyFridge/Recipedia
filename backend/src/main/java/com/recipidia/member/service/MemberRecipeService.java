package com.recipidia.member.service;

import com.recipidia.member.dto.MemberRecipeDto;

import java.util.List;

public interface MemberRecipeService {
  MemberRecipeDto patchMemberRecipe(Long memberId, Long recipeId, Integer rating, Boolean favorite);
  List<MemberRecipeDto> getMemberRecipes(Long memberId);
  List<MemberRecipeDto> getMemberFavorites(Long memberId);
  List<MemberRecipeDto> getMemberRatedRecipes(Long memberId);

}
