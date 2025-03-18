package com.recipidia.user.service;

import com.recipidia.user.dto.UserRecipeDto;
import com.recipidia.user.request.FavoriteReq;
import com.recipidia.user.request.RatingReq;

import java.util.List;

public interface UserRecipeService {
  UserRecipeDto rateRecipe(RatingReq request);
  UserRecipeDto favoriteRecipe(FavoriteReq request);
  List<UserRecipeDto> getUserRecipes(Long userId);
}
