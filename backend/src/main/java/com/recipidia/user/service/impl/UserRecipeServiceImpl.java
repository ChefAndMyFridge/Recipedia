package com.recipidia.user.service.impl;

import com.recipidia.user.dto.UserRecipeDto;
import com.recipidia.user.request.FavoriteReq;
import com.recipidia.user.request.RatingReq;
import com.recipidia.user.service.UserRecipeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserRecipeServiceImpl implements UserRecipeService {
  @Override
  @Transactional
  public UserRecipeDto rateRecipe(RatingReq request) {
    // TODO: 사용자와 레시피를 기반으로 UserRecipe 엔티티를 생성하거나 업데이트하여 별점 정보를 저장하는 로직 구현
    // 예시로 임시 UserRecipeDto 객체를 반환
    return new UserRecipeDto(1L, request.userId(), request.recipeId(), request.rating(), false, null);
  }

  @Override
  @Transactional
  public UserRecipeDto favoriteRecipe(FavoriteReq request) {
    // TODO: 사용자와 레시피를 기반으로 UserRecipe 엔티티를 생성하거나 업데이트하여 즐겨찾기 정보를 저장하는 로직 구현
    // 예시로 임시 UserRecipeDto 객체를 반환
    return new UserRecipeDto(1L, request.userId(), request.recipeId(), null, request.favorite(), null);
  }
}
