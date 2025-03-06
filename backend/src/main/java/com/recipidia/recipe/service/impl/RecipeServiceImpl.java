package com.recipidia.recipe.service.impl;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.service.IngredientService;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.service.RecipeService;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.scheduler.Schedulers;

@Service
public class RecipeServiceImpl implements RecipeService {

    private final IngredientService ingredientService;
    private final WebClient webClient;

    public RecipeServiceImpl(IngredientService ingredientService, WebClient.Builder webClientBuilder) {
        this.ingredientService = ingredientService;
        // FastAPI 컨테이너의 서비스명을 사용
        this.webClient = webClientBuilder.baseUrl("http://my-fastapi:8000").build();
    }

    @Override
    public Mono<ResponseEntity<String>> handleRecipeQuery(RecipeQueryReq request) {
        // DB에서 전체 재료 목록을 조회하는 블로킹 작업은 boundedElastic 스케줄러에서 실행
        return Mono.fromCallable(() -> ingredientService.getAllIngredients())
                .subscribeOn(Schedulers.boundedElastic())
                .map(ingredientInfoDtoList ->
                        ingredientInfoDtoList.stream()
                                .map(IngredientInfoDto::getName)
                                .collect(Collectors.toList())
                )
                .flatMap(fullIngredients -> {
                    Map<String, Object> payload = new HashMap<>();
                    // 요청으로 받은 재료 목록에서 첫 번째 값을 main ingredient로 사용
                    String mainIngredient = request.getIngredients().isEmpty()
                            ? null
                            : request.getIngredients().get(0);
                    payload.put("ingredients", fullIngredients);
                    payload.put("main_ingredient", mainIngredient);

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
