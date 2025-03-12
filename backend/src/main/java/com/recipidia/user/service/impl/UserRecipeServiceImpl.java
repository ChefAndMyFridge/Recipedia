package com.recipidia.user.service.impl;


import com.recipidia.user.dto.UserRecipeDto;
import com.recipidia.user.entity.User;
import com.recipidia.user.entity.UserRecipe;
import com.recipidia.user.exception.RecipeNotFoundException;
import com.recipidia.user.exception.UserNotFoundException;
import com.recipidia.user.repository.UserRepository;
import com.recipidia.user.repository.UserRecipeRepository;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.repository.RecipeRepository;
import com.recipidia.user.request.FavoriteReq;
import com.recipidia.user.request.RatingReq;
import com.recipidia.user.service.UserRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserRecipeServiceImpl implements UserRecipeService {
  private final UserRepository userRepository;
  private final RecipeRepository recipeRepository;
  private final UserRecipeRepository userRecipeRepository;

  @Override
  public UserRecipeDto rateRecipe(RatingReq request) {
    // 사용자와 레시피 엔티티 조회
    User user = userRepository.findById(request.userId())
        .orElseThrow(() -> new UserNotFoundException(request.userId()));
    Recipe recipe = recipeRepository.findById(request.recipeId())
        .orElseThrow(() -> new RecipeNotFoundException(request.recipeId()));

    // 해당 사용자와 레시피의 UserRecipe 레코드가 존재하는지 확인
    Optional<UserRecipe> optionalUserRecipe = userRecipeRepository.findByUserIdAndRecipeId(user.getId(), recipe.getId());
    UserRecipe userRecipe;
    if (optionalUserRecipe.isPresent()) {
      // 기존 레코드가 있다면 별점만 업데이트
      userRecipe = optionalUserRecipe.get();
      userRecipe.updateRating(request.rating());
    } else {
      // 없으면 새로 생성 (즐겨찾기는 기본 false로 설정)
      userRecipe = UserRecipe.builder()
          .user(user)
          .recipe(recipe)
          .rating(request.rating())
          .favorite(false)
          .createdAt(LocalDateTime.now())
          .build();
    }
    userRecipeRepository.save(userRecipe);
    return UserRecipeDto.fromEntity(userRecipe);
  }

  @Override
  public UserRecipeDto favoriteRecipe(FavoriteReq request) {
    // 사용자와 레시피 엔티티 조회
    User user = userRepository.findById(request.userId())
        .orElseThrow(() -> new UserNotFoundException(request.userId()));
    Recipe recipe = recipeRepository.findById(request.recipeId())
        .orElseThrow(() -> new RecipeNotFoundException(request.recipeId()));

    // 해당 사용자와 레시피의 UserRecipe 레코드가 존재하는지 확인
    Optional<UserRecipe> optionalUserRecipe = userRecipeRepository.findByUserIdAndRecipeId(user.getId(), recipe.getId());
    UserRecipe userRecipe;
    if (optionalUserRecipe.isPresent()) {
      // 기존 레코드가 있다면 즐겨찾기 값만 업데이트
      userRecipe = optionalUserRecipe.get();
      userRecipe.updateFavorite(request.favorite());
    } else {
      // 없으면 새로 생성 (별점은 null로 설정)
      userRecipe = UserRecipe.builder()
          .user(user)
          .recipe(recipe)
          .rating(null)
          .favorite(request.favorite())
          .createdAt(LocalDateTime.now())
          .build();
    }
    userRecipeRepository.save(userRecipe);
    return UserRecipeDto.fromEntity(userRecipe);
  }
}
