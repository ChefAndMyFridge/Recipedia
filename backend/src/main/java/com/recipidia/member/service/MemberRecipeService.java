package com.recipidia.member.service;

import com.recipidia.member.dto.MemberRecipeDto;
import com.recipidia.member.request.FavoriteReq;
import com.recipidia.member.request.RatingReq;

import java.util.List;

public interface MemberRecipeService {
  MemberRecipeDto rateRecipe(RatingReq request);
  MemberRecipeDto favoriteRecipe(FavoriteReq request);
  List<MemberRecipeDto> getMemberRecipes(Long memberId);
}
