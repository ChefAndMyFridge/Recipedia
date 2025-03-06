package com.recipidia.recipe.controller;

import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
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
  public Mono<ResponseEntity<String>> queryRecipe(@RequestBody RecipeQueryReq request) {
    return recipeService.handleRecipeQuery(request)
        .flatMap(response ->
            recipeService.saveRecipeResult(response)
                .thenReturn(response)
        );
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
  @GetMapping
  public Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes() {
    return recipeService.getAllRecipes();
  }
}
