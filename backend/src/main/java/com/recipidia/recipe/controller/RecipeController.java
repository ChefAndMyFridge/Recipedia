package com.recipidia.recipe.controller;

import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.response.RecipeQueryCustomResponse;
import com.recipidia.recipe.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recipe")
@RequiredArgsConstructor
public class RecipeController {

  private final RecipeService recipeService;

  @Operation(
      summary = "레시피 쿼리 요청",
      description = "FIGMA : 레시피 ㅇㅇ 모달",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "레시피 쿼리 요청 정보",
          required = true,
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = RecipeQueryReq.class),
              examples = {
                  @ExampleObject(
                      name = "요청 데이터",
                      value = """
                          {
                              "ingredients": ["돼지고기", "대파"]
                          }
                          """
                  )
              }
          )
      )
  )
  @PostMapping
  public Mono<ResponseEntity<RecipeQueryCustomResponse>> queryRecipe(@RequestBody RecipeQueryReq request) {
    return recipeService.handleRecipeQuery(request)
        .flatMap(responseEntity ->
            recipeService.saveRecipeResult(responseEntity)
                .thenReturn(responseEntity)
        )
        .flatMap(recipeService::mapQueryResponse)
        .map(ResponseEntity::ok);
  }

  @Operation(
      summary = "전체 레시피 조회",
      description = "FIGMA : 레시피 리스트 페이지?",
      responses = {
          @ApiResponse(responseCode = "200", description = "레시피 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = RecipeDto.class),
                  examples = {
                      @ExampleObject(
                          name = "응답 데이터",
                          value = """
                              [
                                {
                                  "id": 1,
                                  "name": "돼지고기 계란 볶음",
                                  "youtubeUrl": "https://www.youtube.com/watch?v=MvxXe4gDjcI",
                                  "textRecipe": null,
                                  "ingredients": [
                                    {
                                      "id": 1,
                                      "recipeId": 1,
                                      "name": "돼지고기",
                                      "quantity": "1근"
                                    }
                                  ]
                                },
                                {
                                  "id": 2,
                                  "name": "돼지고기 사과 조림",
                                  "youtubeUrl": "https://www.youtube.com/watch?v=IzsOPD4Yh8Y",
                                  "textRecipe": null,
                                  "ingredients": [
                                    {
                                      "id": 2,
                                      "recipeId": 2,
                                      "name": "돼지고기",
                                      "quantity": "1근"
                                    }
                                  ]
                                }
                              ]
                              """
                      )
                  }))
      }
  )
  @GetMapping("/check")
  public Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes() {
    return recipeService.getAllRecipes();
  }


  @Operation(
      summary = "특정 레시피 텍스트 추출",
      description = "FIGMA : 레시피 ㅇㅇ ㅇㅇ",
      responses = {
          @ApiResponse(responseCode = "200", description = "텍스트 레시피 추출 성공",
              content = @Content(schema = @Schema(implementation = RecipeExtractRes.class),
                  examples = {
                      @ExampleObject(
                          name = "응답 데이터",
                          value = """
                              {
                                  title: string,
                                  cooking_info: {
                                      cooking_time: string,
                                      kcal: number
                                  },
                                  ingredients: string[],
                                  cooking_tools: string[],
                                  cooking_tips: string[],
                                  cooking_sequence: {
                                      [step: string]: string[]
                                  }
                              }
                              """
                      )
                  }))
      }
  )
  @GetMapping("/{recipeId}")
  public Mono<ResponseEntity<RecipeExtractRes>> extractAndSaveRecipe(@PathVariable Long recipeId) {
      return recipeService.extractRecipe(recipeId)
              .flatMap(extractRes ->
                      recipeService.saveExtractResult(recipeId, extractRes)
                              .thenReturn(extractRes)
              )
              .map(ResponseEntity::ok);
  }
}
