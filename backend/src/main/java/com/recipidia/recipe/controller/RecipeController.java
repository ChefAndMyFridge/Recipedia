package com.recipidia.recipe.controller;

import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

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
    return recipeService.handleRecipeQuery(request);
  }
}
