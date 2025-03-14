package com.recipidia.recipe.controller;

import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeExtractRes;
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
      ),
      responses = {
          @ApiResponse(responseCode = "200", description = "레시피 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = RecipeDto.class),
                  examples = {
                      @ExampleObject(
                          name = "응답 데이터",
                          value = """
                              {
                                "dishes":[
                                   "감자 샐러드",
                                   "고구마 구이",
                                   "두부 스테이크",
                                   "양배추 쌈",
                                   "비지찌개"
                                ],
                                "videos":{
                                   "감자 샐러드":[
                                      {
                                         "title":"감자가 있다면 꼭 이렇게 만들어 보세요!! 맛있고 영양가 높은 아침 식사가 해결돼요~ 전문점보다 더 맛있는 감자 샐러드 만들기",
                                         "url":"https://www.youtube.com/watch?v=IQeOvKCt9FE",
                                         "relevance_score":1.0
                                      }
                                   ],
                                   "고구마 구이":[
                                      {
                                         "title":"이렇게 구워야 꿀고구마가 됩니다 #shorts #고구마 #에어프라이어",
                                         "url":"https://www.youtube.com/watch?v=NVkJqs9SXtA",
                                         "relevance_score":0.8
                                      }
                                   ],
                                   "두부 스테이크":[
                                      {
                                         "title":"2천원으로 스테이크 만들기",
                                         "url":"https://www.youtube.com/watch?v=kGIGdhLGAc4",
                                         "relevance_score":0.2
                                      }
                                   ],
                                   "양배추 쌈":[
                                      {
                                         "title":"이 방법으로 양배추 쌈 먹고 폭풍 감량 꼬고!!🔥 #양배추 #양배추요리 #양배추쌈 #양배추찜 #양배추레시피 #풍자쌈장 #다이어트식단 #다이어트레시피 #다이어터식단 #다이어터",
                                         "url":"https://www.youtube.com/watch?v=r--8cLCyeJI",
                                         "relevance_score":1.0
                                      }
                                   ],
                                   "비지찌개":[
                                      {
                                         "title":"비지찌개! 이렇게 고소하면 반칙인데요?",
                                         "url":"https://www.youtube.com/watch?v=lDr6lNjUZ8w",
                                         "relevance_score":1.0
                                      }
                                   ]
                                },
                                "execution_time":3.302408218383789
                              }
                              """
                      )
                  }))
      }
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
