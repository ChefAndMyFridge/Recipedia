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
                            Optional<Recipe> existing = recipeRepository.findByYoutubeUrl(youtubeUrl);
                            if (existing.isEmpty()) {
                                Recipe recipe = Recipe.builder()
                                    .name(dish)
                                    .youtubeUrl(youtubeUrl)
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
                Map<String, String> payload = new HashMap<>();
                payload.put("youtube_url", recipe.getYoutubeUrl());
                return webClient.post()
                    .uri("/api/f1/recipe/") // FastAPI의 추출 엔드포인트 URL
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(RecipeExtractRes.class);
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
                // 추출 결과를 이용해 Recipe 업데이트
                recipe.setTextRecipe(extractRes.getTitle()); // 현재 Title만 가져다 붙이는데, 파싱한 텍스트를 넣거나 Json을 통으로 붙여야 할 것
                // AI 쪽과 협의 후 진행
                // 기존 ingredients를 모두 제거한 후, 새로 추가
                recipe.getIngredients().clear();
                extractRes.getIngredients().forEach(ingredientName -> {
                    RecipeIngredient ingredient = RecipeIngredient.builder()
                        .recipe(recipe)
                        .name(ingredientName)
                        .quantity("1개") // 수량은 추후 업데이트
                        .build();
                    recipe.getIngredients().add(ingredient);
                });
                return Mono.fromCallable(() -> recipeRepository.save(recipe))
                    .subscribeOn(Schedulers.boundedElastic())
                    .then();
            });
    }
}
