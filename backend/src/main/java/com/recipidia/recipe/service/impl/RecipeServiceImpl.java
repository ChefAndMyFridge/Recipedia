package com.recipidia.recipe.service.impl;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.service.IngredientService;
import com.recipidia.recipe.converter.RecipeQueryResConverter;
import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.dto.VideoInfo;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.entity.RecipeIngredient;
import com.recipidia.recipe.exception.NoRecipeException;
import com.recipidia.recipe.repository.RecipeRepository;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.*;
import com.recipidia.recipe.service.RecipeService;
import com.recipidia.user.repository.UserRecipeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

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
  private final RecipeQueryResConverter queryResConverter = new RecipeQueryResConverter();
  private final UserRecipeRepository userRecipeRepository;

  public RecipeServiceImpl(IngredientService ingredientService, WebClient.Builder webClientBuilder,
                           RecipeRepository recipeRepository, UserRecipeRepository userRecipeRepository) {
    this.ingredientService = ingredientService;
    // FastAPI 컨테이너의 서비스명을 사용
    this.webClient = webClientBuilder.baseUrl("http://my-fastapi:8000").build();
    this.recipeRepository = recipeRepository;
    this.userRecipeRepository = userRecipeRepository;
  }

  @Override
  @Transactional
  public Mono<ResponseEntity<RecipeQueryRes>> handleRecipeQuery(RecipeQueryReq request) {
    // 1. 전체 재료 목록 조회 단계 (DB 호출)
    Mono<List<String>> fullIngredientsMono = Mono.fromCallable(ingredientService::getAllIngredients)
        .subscribeOn(Schedulers.boundedElastic())
        .map(list -> list.stream()
            .map(IngredientInfoDto::getName)
            .collect(Collectors.toList())
        );

    // 2. FastAPI 호출 단계
    Mono<RecipeQueryRes> fastApiResponseMono = fullIngredientsMono.flatMap(fullIngredients -> {
      Map<String, Object> payload = new HashMap<>();
      payload.put("ingredients", fullIngredients);
      payload.put("main_ingredients", request.getIngredients());

      return webClient.post()
          .uri("/api/f1/query/")
          .contentType(MediaType.APPLICATION_JSON)
          .bodyValue(payload)
          // FastAPI 응답을 String으로 받아서 Converter를 통해 변환합니다.
          .retrieve()
          .bodyToMono(String.class)
          .map(queryResConverter::convertToEntityAttribute);
    });

    // 최종적으로 ResponseEntity로 매핑
    return fastApiResponseMono
        .map(ResponseEntity::ok)
        .onErrorResume(e ->
            Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null))
        );
  }

  @Override
  @Transactional
  public Mono<Void> saveRecipeResult(ResponseEntity<RecipeQueryRes> responseEntity) {
    return Mono.fromCallable(() -> {
          RecipeQueryRes recipeQueryRes = responseEntity.getBody();
          if (recipeQueryRes == null || recipeQueryRes.getDishes() == null) {
            // 응답이 비어있으면 비어있는 응답 반환. 필요 시 나중에 검색 결과가 없습니다 처리
            return Mono.empty();
          }
          // 각 dish(레시피 이름)에 대해 반복
          for (String dish : recipeQueryRes.getDishes()) {
            List<VideoInfo> videoInfos = recipeQueryRes.getVideos().get(dish);
            if (videoInfos != null && !videoInfos.isEmpty()) {
              for (VideoInfo videoInfo : videoInfos) {
                String youtubeUrl = videoInfo.getUrl();
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
                  recipeRepository.save(recipe);
                }
              }
            }
          }
          return null;
        }).subscribeOn(Schedulers.boundedElastic())
        .then();
  }

  @Override
  public Mono<RecipeQueryCustomResponse> mapQueryResponse(ResponseEntity<RecipeQueryRes> responseEntity, Long userId) {
    RecipeQueryRes queryRes = responseEntity.getBody();
    if (queryRes == null) {
      return Mono.error(new RuntimeException("Response body is null"));
    }

    return Flux.fromIterable(queryRes.getVideos().entrySet())
        .flatMap(entry -> {
          String dish = entry.getKey();
          List<VideoInfo> videoList = entry.getValue();
          return Flux.fromIterable(videoList)
              .flatMap(video -> convertVideoInfo(video, userId))
              .collectList()
              .map(videoInfoList -> Tuples.of(dish, videoInfoList));
        })
        .collectMap(Tuple2::getT1, Tuple2::getT2)
        .map(videosMap -> RecipeQueryCustomResponse.builder()
            .dishes(queryRes.getDishes())
            .videos(videosMap)
            .build());
  }

  private Mono<VideoInfoCustomResponse> convertVideoInfo(VideoInfo video, Long userId) {
    return Mono.fromCallable(() -> recipeRepository.findIdByYoutubeUrl(video.getUrl()))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(recipeId ->
            Mono.fromCallable(() -> userRecipeRepository.findByUserIdAndRecipeId(userId, recipeId))
                .subscribeOn(Schedulers.boundedElastic())
                .map(optionalUserRecipe -> {
                  boolean favorite = false;
                  double rating = 0.0;
                  if (optionalUserRecipe.isPresent()) {
                    favorite = optionalUserRecipe.get().getFavorite();
                    rating = optionalUserRecipe.get().getRating();
                  }
                  return VideoInfoCustomResponse.builder()
                      .recipeId(recipeId)
                      .title(video.getTitle())
                      .url(video.getUrl())
                      .channel_title(video.getChannel_title())
                      .duration(video.getDuration())
                      .view_count(video.getView_count())
                      .like_count(video.getLike_count())
                      .favorite(favorite)
                      .rating(rating)
                      .build();
                })
        );
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
    return Mono.justOrEmpty(recipeRepository.findById(recipeId))
        .switchIfEmpty(Mono.error(new NoRecipeException("Recipe not found")))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(recipe -> {
          if (recipe.getTextRecipe() != null) {
            return Mono.just(recipe.getTextRecipe());
          }
          Map<String, String> payload = new HashMap<>();
          payload.put("youtube_url", recipe.getYoutubeUrl());
          return webClient.post()
              .uri("/api/f1/recipe/")
              .contentType(MediaType.APPLICATION_JSON)
              .bodyValue(payload)
              .retrieve()
              .bodyToMono(RecipeExtractRes.class)
              .flatMap(extractRes -> saveExtractResult(recipeId, extractRes)
                  .thenReturn(extractRes));
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
