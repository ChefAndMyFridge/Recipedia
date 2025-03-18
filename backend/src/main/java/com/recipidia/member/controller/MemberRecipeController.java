package com.recipidia.member.controller;

import com.recipidia.member.dto.MemberRecipeDto;
import com.recipidia.member.request.FavoriteReq;
import com.recipidia.member.request.RatingReq;
import com.recipidia.member.service.MemberRecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/recipe")
@RequiredArgsConstructor
public class MemberRecipeController {
  private final MemberRecipeService memberRecipeService;

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
                  schema = @Schema(implementation = MemberRecipeDto.class)
              )
          )
      }
  )
  @PostMapping("/rating")
  public ResponseEntity<MemberRecipeDto> rateRecipe(@RequestBody RatingReq ratingRequest) {
    MemberRecipeDto result = memberRecipeService.rateRecipe(ratingRequest);
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
                  schema = @Schema(implementation = MemberRecipeDto.class)
              )
          )
      }
  )
  @PostMapping("/favorite")
  public ResponseEntity<MemberRecipeDto> favoriteRecipe(@RequestBody FavoriteReq favoriteRequest) {
    MemberRecipeDto result = memberRecipeService.favoriteRecipe(favoriteRequest);
    return ResponseEntity.ok(result);
  }

  @Operation(
      summary = "사용자의 즐겨찾기 레시피 목록 조회",
      description = "특정 사용자가 평가하거나 즐겨찾기한 모든 레시피 목록을 조회합니다.",
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "사용자 레시피 목록 조회 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberRecipeDto.class),
                  examples = @ExampleObject(value = """
                    [
                      {
                        "userRecipeId": 1,
                        "userId": 10,
                        "recipeId": 100,
                        "rating": 5,
                        "favorite": true,
                        "createdAt": "2025-03-18T13:45:00"
                      },
                      {
                        "userRecipeId": 2,
                        "userId": 10,
                        "recipeId": 101,
                        "rating": 4,
                        "favorite": false,
                        "createdAt": "2025-03-17T11:30:00"
                      }
                    ]
                """)
              )
          ),
          @ApiResponse(
              responseCode = "404",
              description = "사용자를 찾을 수 없음",
              content = @Content(
                  mediaType = "application/json",
                  examples = @ExampleObject(value = "{\"message\": \"User not found with id: 10\"}")
              )
          )
      }
  )
  @GetMapping("/{userId}")
  public ResponseEntity<List<MemberRecipeDto>> getUserRecipes(@PathVariable Long userId) {
    List<MemberRecipeDto> userRecipes = memberRecipeService.getUserRecipes(userId);
    return ResponseEntity.ok(userRecipes);
  }
}
