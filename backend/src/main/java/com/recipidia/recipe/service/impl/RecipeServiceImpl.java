package com.recipidia.recipe.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.service.IngredientService;
import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.entity.RecipeIngredient;
import com.recipidia.recipe.exception.NoRecipeException;
import com.recipidia.recipe.repository.RecipeRepository;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.response.RecipeQueryRes;
import com.recipidia.recipe.response.VideoInfo;
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
    private final ObjectMapper objectMapper;

    public RecipeServiceImpl(IngredientService ingredientService, WebClient.Builder webClientBuilder,
                             RecipeRepository recipeRepository, ObjectMapper objectMapper) {
        this.ingredientService = ingredientService;
        // FastAPI 컨테이너의 서비스명을 사용
        this.webClient = webClientBuilder.baseUrl("http://my-fastapi:8000").build();
        this.recipeRepository = recipeRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public Mono<ResponseEntity<String>> handleRecipeQuery(RecipeQueryReq request) {
        // 1. 전체 재료 목록 조회 단계 (DB 호출)
        Mono<List<String>> fullIngredientsMono = Mono.fromCallable(ingredientService::getAllIngredients)
            .subscribeOn(Schedulers.boundedElastic())
            .map(ingredientInfoDtoList ->
                ingredientInfoDtoList.stream()
                    .map(IngredientInfoDto::getName)
                    .collect(Collectors.toList())
            );

        // 2. FastAPI 호출 단계
        Mono<String> fastApiResponseMono = fullIngredientsMono.flatMap(fullIngredients -> {
            Map<String, Object> payload = new HashMap<>();
            payload.put("ingredients", fullIngredients);
            payload.put("main_ingredients", request.getIngredients());

            return webClient.post()
                .uri("/api/f1/query/")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class);
        });

        // 최종적으로 ResponseEntity로 매핑
        return fastApiResponseMono
            .map(ResponseEntity::ok)
            .onErrorResume(e ->
                Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage()))
            );
    }

    @Override
    @Transactional
    public Mono<Void> saveRecipeResult(ResponseEntity<String> responseEntity) {
        return Mono.fromCallable(() -> {
                RecipeQueryRes recipeQueryRes = objectMapper.readValue(responseEntity.getBody(), RecipeQueryRes.class);
                // 각 dish(레시피 이름)에 대해 반복
                for (String dish : recipeQueryRes.getDishes()) {
                    // 별도 파일로 분리된 VideoInfo를 사용
                    List<VideoInfo> videoInfos = recipeQueryRes.getVideos().get(dish);
                    if (videoInfos != null && !videoInfos.isEmpty()) {
                        // dish 내의 모든 영상 정보를 반복 처리
                        for (VideoInfo videoInfo : videoInfos) {
                            String youtubeUrl = videoInfo.getUrl();
                            // 이미 저장된 URL 인 경우 새로 등록 안하고 스킵
                            Optional<Recipe> existing = recipeRepository.findByYoutubeUrl(youtubeUrl);
                            if (existing.isEmpty()) {
                              Recipe recipe = Recipe.builder()
                                  .name(dish)
                                  .title(videoInfo.getTitle())
                                  .youtubeUrl(videoInfo.getUrl())
                                  .channelTitle(videoInfo.getChannel_title())
                                  .duration(videoInfo.getDuration())
                                  .viewCount(videoInfo.getView_count())
                                  .likeCount(videoInfo.getLike_count())
                                  .build();
                                Recipe savedRecipe = recipeRepository.save(recipe);
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

    @Override
    @Transactional
    public Mono<RecipeExtractRes> extractRecipe(Long recipeId) {
        return Mono.fromCallable(() -> recipeRepository.findById(recipeId))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(optionalRecipe -> {
                    if (optionalRecipe.isEmpty()) {
                        return Mono.error(new NoRecipeException("Recipe not found"));
                    }
                    Recipe recipe = optionalRecipe.get();
                    // 이미 추출된 결과가 있으면 재추출하지 않고 반환
                    if (recipe.getTextRecipe() != null) {
                        return Mono.just(recipe.getTextRecipe());
                    }
                    // 없으면 웹 클라이언트를 통해 추출 수행
                    Map<String, String> payload = new HashMap<>();
                    payload.put("youtube_url", recipe.getYoutubeUrl());
                    return webClient.post()
                            .uri("/api/f1/recipe/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(payload)
                            .retrieve()
                            .bodyToMono(RecipeExtractRes.class)
                            // 추출 후 DB에 저장하는 로직 추가
                            .flatMap(extractRes -> saveExtractResult(recipeId, extractRes)
                                    .thenReturn(extractRes)
                            );
                });
    }

    @Override
    @Transactional
    public Mono<Void> saveExtractResult(Long recipeId, RecipeExtractRes extractRes) {
        return Mono.fromCallable(() -> recipeRepository.findByIdWithIngredients(recipeId))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(optionalRecipe -> {
                    if (optionalRecipe.isEmpty()) {
                        return Mono.error(new NoRecipeException("Recipe not found"));
                    }
                    Recipe recipe = optionalRecipe.get();
                    // 추출 결과 전체를 RecipeExtractRes로 저장
                    recipe.modifyTextRecipe(extractRes);
                    // 기존 ingredients 업데이트 (필요 시)
                    recipe.getIngredients().clear();
                    extractRes.getIngredients().forEach(ingredient -> {
                      RecipeIngredient ingredientEntity = RecipeIngredient.builder()
                          .recipe(recipe)
                          .name(ingredient.getName())
                          .quantity(ingredient.getQuantity())
                          .build();
                      recipe.getIngredients().add(ingredientEntity);
                    });
                    return Mono.fromCallable(() -> recipeRepository.save(recipe))
                            .subscribeOn(Schedulers.boundedElastic())
                            .then();
                });
    }
}
