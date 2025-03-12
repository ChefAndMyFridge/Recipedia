package com.recipidia.user.controller;

import com.recipidia.user.dto.UserRecipeDto;
import com.recipidia.user.request.FavoriteReq;
import com.recipidia.user.request.RatingReq;
import com.recipidia.user.service.UserRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/recipe")
@RequiredArgsConstructor
public class UserRecipeController {
  private final UserRecipeService userRecipeService;

  // 1. 사용자가 레시피에 별점을 줄 때 호출되는 API
  @PostMapping("/rating")
  public ResponseEntity<UserRecipeDto> rateRecipe(@RequestBody RatingReq ratingRequest) {
    UserRecipeDto result = userRecipeService.rateRecipe(ratingRequest);
    return ResponseEntity.ok(result);
  }

  // 2. 사용자가 레시피를 즐겨찾기 등록할 때 호출되는 API
  @PostMapping("/favorite")
  public ResponseEntity<UserRecipeDto> favoriteRecipe(@RequestBody FavoriteReq favoriteRequest) {
    UserRecipeDto result = userRecipeService.favoriteRecipe(favoriteRequest);
    return ResponseEntity.ok(result);
  }
}
