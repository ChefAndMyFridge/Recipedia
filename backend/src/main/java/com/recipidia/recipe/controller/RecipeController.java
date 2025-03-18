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
                              "user_id" : 1,
                              "ingredients": ["돼지고기", "대파"]
                          }
                          """
                  )
              }
          )
      ),
      responses = {
          @ApiResponse(responseCode = "200", description = "레시피 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = RecipeDto.class),
                  examples = {
                      @ExampleObject(
                          name = "응답 데이터",
                          value = """
                              {
                                "dishes": [
                                  "불고기",
                                  "소고기 볶음밥",
                                  "페퍼 스테이크"
                                ],
                                "videos": {
                                  "불고기": [
                                    {
                                      "recipeId" : 1,
                                      "title": "양념 4개면 '소불고기' 끝!",
                                      "url": "https://www.youtube.com/watch?v=nVzwOOJLt24",
                                      "channel_title": "백종원 PAIK JONG WON",
                                      "duration": "11:39",
                                      "view_count": 4637323,
                                      "like_count": 47830,
                                      "favorite": false,
                                      "rating": 3.8
                                    }
                                  ],
                                  "소고기 볶음밥": [
                                    {
                                      "recipeId" : 2,
                                      "title": "[이연복] 고기 볶음밥",
                                      "url": "https://www.youtube.com/watch?v=Gp3AqI76Fyk",
                                      "channel_title": "이연복의 복주머니",
                                      "duration": "8:27",
                                      "view_count": 1210887,
                                      "like_count": 20958,
                                      "favorite": false,
                                      "rating": 2.6
                                    }
                                  ],
                                  "페퍼 스테이크": [
                                    {
                                      "recipeId" : 3,
                                      "title": "소고기 볶음 레시피 ㅣ 베이킹 소다 연육 시리즈 - 저렴한 부위 30분만에 안심처럼 연하게 만드는 법",
                                      "url": "https://www.youtube.com/watch?v=CWXPUpr_iHw",
                                      "channel_title": "더 프로키친 [The Prokitchen]",
                                      "duration": "11:47",
                                      "view_count": 45840,
                                      "like_count": 984,
                                      "favorite": true,
                                      "rating": 4.2
                                    }
                                  ]
                                }
                              }
                              """
                      )
                  }))
      }
  )
  @PostMapping
  public Mono<ResponseEntity<RecipeQueryCustomResponse>> queryRecipe(@RequestBody RecipeQueryReq request) {
    return recipeService.handleRecipeQuery(request)
        .flatMap(responseEntity ->
            recipeService.saveRecipeResult(responseEntity)
                .thenReturn(responseEntity)
        )
        .flatMap(responseEntity -> recipeService.mapQueryResponse(responseEntity, request.getUserId()))
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
                                      [step: string]: {
                                          sequence : string[]
                                          timestamp : number
                                      }
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
