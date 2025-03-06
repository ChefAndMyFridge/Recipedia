package com.recipidia.recipe.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.service.IngredientService;
import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.entity.RecipeIngredient;
import com.recipidia.recipe.repository.RecipeIngredientRepository;
import com.recipidia.recipe.repository.RecipeRepository;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeQueryRes;
import com.recipidia.recipe.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RecipeServiceImpl implements RecipeService {

    private final IngredientService ingredientService;
    private final WebClient webClient;
    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final ObjectMapper objectMapper;

    public RecipeServiceImpl(IngredientService ingredientService, WebClient.Builder webClientBuilder,
                             RecipeRepository recipeRepository, RecipeIngredientRepository recipeIngredientRepository,
                             ObjectMapper objectMapper) {
        this.ingredientService = ingredientService;
        // FastAPI 컨테이너의 서비스명을 사용
        this.webClient = webClientBuilder.baseUrl("http://my-fastapi:8000").build();
        this.recipeRepository = recipeRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public Mono<ResponseEntity<String>> handleRecipeQuery(RecipeQueryReq request) {
        // DB에서 전체 재료 목록을 조회하는 블로킹 작업은 boundedElastic 스케줄러에서 실행
        return Mono.fromCallable(ingredientService::getAllIngredients)
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
            .map(ResponseEntity::ok)
            .onErrorResume(e ->
                        Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error: " + e.getMessage()))
                );
    }

    @Override
    @Transactional
    public Mono<Void> saveRecipeResult(ResponseEntity<String> responseEntity, String mainIngredient) {
        return Mono.fromCallable(() -> {
                RecipeQueryRes recipeQueryRes = objectMapper.readValue(responseEntity.getBody(), RecipeQueryRes.class);
                // 각 dish(레시피 이름)에 대해 반복
                for (String dish : recipeQueryRes.getDishes()) {
                    List<RecipeQueryRes.VideoInfo> videoInfos = recipeQueryRes.getVideos().get(dish);
                    if (videoInfos != null && !videoInfos.isEmpty()) {
                        // dish 내의 모든 영상 정보를 반복 처리
                        for (RecipeQueryRes.VideoInfo videoInfo : videoInfos) {
                            String youtubeUrl = videoInfo.getUrl();
                            Optional<Recipe> existing = recipeRepository.findByYoutubeUrl(youtubeUrl);
                            if (existing.isEmpty()) {
                                Recipe recipe = Recipe.builder()
                                    .name(dish)
                                    .youtubeUrl(youtubeUrl)
                                    .build();
                                Recipe savedRecipe = recipeRepository.save(recipe);
                                RecipeIngredient recipeIngredient = RecipeIngredient.builder()
                                    .recipe(savedRecipe)
                                    .name(mainIngredient)
                                    .quantity("") // 수량은 추후 업데이트
                                    .build();
                                recipeIngredientRepository.save(recipeIngredient);
                            }
                        }
                    }
                }
                return null;
            }).subscribeOn(Schedulers.boundedElastic())
            .then();
    }

    @Override
    @Transactional
    public Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes() {
        return Mono.fromCallable(recipeRepository::findAllWithIngredients)
            .subscribeOn(Schedulers.boundedElastic())
            .map(recipes -> recipes.stream()
                .map(RecipeDto::fromEntity)
                .collect(Collectors.toList()))
            .map(ResponseEntity::ok)
            .onErrorResume(e ->
                Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build())
            );
    }
}
