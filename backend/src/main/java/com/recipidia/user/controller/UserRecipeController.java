package com.recipidia.user.controller;

import com.recipidia.user.dto.UserRecipeDto;
import com.recipidia.user.request.FavoriteReq;
import com.recipidia.user.request.RatingReq;
import com.recipidia.user.service.UserRecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/recipe")
@RequiredArgsConstructor
public class UserRecipeController {
  private final UserRecipeService userRecipeService;

  // 1. 사용자가 레시피에 별점을 줄 때 호출되는 API
  @Operation(
      summary = "레시피 별점 평가",
      description = "사용자가 레시피에 별점을 평가합니다.",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "별점 평가 요청 정보",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = RatingReq.class)
          )
      ),
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "레시피 별점 평가 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = UserRecipeDto.class)
              )
          )
      }
  )
  @PostMapping("/rating")
  public ResponseEntity<UserRecipeDto> rateRecipe(@RequestBody RatingReq ratingRequest) {
    UserRecipeDto result = userRecipeService.rateRecipe(ratingRequest);
    return ResponseEntity.ok(result);
  }

  // 2. 사용자가 레시피를 즐겨찾기 등록할 때 호출되는 API
  @Operation(
      summary = "레시피 즐겨찾기 등록",
      description = "사용자가 레시피를 즐겨찾기에 추가합니다.",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "즐겨찾기 요청 정보",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = FavoriteReq.class)
          )
      ),
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "레시피 즐겨찾기 등록 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = UserRecipeDto.class)
              )
          )
      }
  )
  @PostMapping("/favorite")
  public ResponseEntity<UserRecipeDto> favoriteRecipe(@RequestBody FavoriteReq favoriteRequest) {
    UserRecipeDto result = userRecipeService.favoriteRecipe(favoriteRequest);
    return ResponseEntity.ok(result);
  }
}
