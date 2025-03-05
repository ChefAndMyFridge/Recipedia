package com.recipidia.recipe.controller;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.service.IngredientService;
import com.recipidia.recipe.request.RecipeRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.scheduler.Schedulers;

@RestController
@RequestMapping("/api/v1")
public class RecipeController {

    private final IngredientService ingredientService;
    private final WebClient webClient;

    @Autowired
    public RecipeController(IngredientService ingredientService, WebClient.Builder webClientBuilder) {
        this.ingredientService = ingredientService;
        // FastAPI 서버의 기본 URL을 설정 (예: http://localhost:8000)
        this.webClient = webClientBuilder.baseUrl("http://my-fastapi:8000").build();
    }

    @PostMapping("/recipe")
    public Mono<ResponseEntity<String>> handleRecipe(@RequestBody RecipeRequest recipeRequest) {
        // 기존 DB의 전체 재료 정보(IngredientInfoDto 리스트)를 가져옵니다.
        // IngredientInfoDto는 이미 기존 코드에서 정의되어 있으며, getName()으로 재료명을 반환합니다.
        return Mono.fromCallable(() -> ingredientService.getAllIngredients())
                .subscribeOn(Schedulers.boundedElastic()) // 블로킹 작업을 별도 스레드에서 실행
                .map(ingredientInfoDtoList ->
                        ingredientInfoDtoList.stream()
                                .map(IngredientInfoDto::getName)
                                .collect(Collectors.toList())
                )
                .flatMap(fullIngredients -> {
                    // FastAPI에 전달할 payload 구성:
                    // "ingredients"에는 DB에서 조회한 전체 재료 목록,
                    // "main_ingredient"에는 프론트엔드에서 전달받은 재료 목록을 담습니다.
                    Map<String, Object> payload = new HashMap<>();

                    // 메인 재료 목록을 보내야 하는데, 현재 AI 쪽에 단일 문자열을 받도록 되어있어 수정 전엔 임시로 이렇게 사용해야 합니다.
                    // 예를 들어, 재료 리스트의 첫 번째 요소를 main_ingredient로 사용
                    String mainIngredient = recipeRequest.getIngredients().isEmpty()
                            ? null
                            : recipeRequest.getIngredients().get(0);

                    payload.put("ingredients", fullIngredients);  // 전체 재료 목록 (List<String>)
                    payload.put("main_ingredient", mainIngredient); // 단일 문자열
//                    payload.put("main_ingredient", recipeRequest.getIngredients()); // 전체 문자열


                    // WebClient를 사용해 FastAPI의 /api/f1/query 엔드포인트로 POST 요청을 보냅니다.
                    return webClient.post()
                            .uri("/api/f1/query/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(payload)
                            .retrieve()
                            .bodyToMono(String.class);
                })
                .map(response -> ResponseEntity.ok(response))
                .onErrorResume(e ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error: " + e.getMessage()))
                );
    }
}
