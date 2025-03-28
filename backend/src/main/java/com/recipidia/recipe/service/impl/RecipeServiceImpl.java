package com.recipidia.recipe.service.impl;

import com.recipidia.filter.entity.MemberFilter;
import com.recipidia.filter.repository.MemberFilterRepository;
import com.recipidia.filter.service.IngredientFilterService;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.service.IngredientService;
import com.recipidia.member.entity.MemberRecipe;
import com.recipidia.recipe.converter.RecipeQueryResConverter;
import com.recipidia.recipe.dto.RecipeDetailDto;
import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.dto.VideoInfo;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.entity.RecipeIngredient;
import com.recipidia.recipe.exception.NoRecipeException;
import com.recipidia.recipe.repository.RecipeRepository;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.*;
import com.recipidia.recipe.service.RecipeService;
import com.recipidia.member.repository.MemberRecipeRepository;
import lombok.extern.slf4j.Slf4j;
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

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
public class RecipeServiceImpl implements RecipeService {

  private final IngredientService ingredientService;
  private final IngredientFilterService ingredientFilterService;
  private final WebClient webClient;
  private final RecipeRepository recipeRepository;
  private final RecipeQueryResConverter queryResConverter = new RecipeQueryResConverter();
  private final MemberRecipeRepository memberRecipeRepository;
  private final MemberFilterRepository memberFilterRepository;

  public RecipeServiceImpl(IngredientService ingredientService,
                           IngredientFilterService ingredientFilterService, WebClient webClient,
                           RecipeRepository recipeRepository, MemberRecipeRepository memberRecipeRepository,
                           MemberFilterRepository memberFilterRepository) {
    this.ingredientService = ingredientService;
    this.ingredientFilterService = ingredientFilterService;
    // FastAPI 컨테이너의 서비스명을 사용
    this.webClient = webClient;
    this.recipeRepository = recipeRepository;
    this.memberRecipeRepository = memberRecipeRepository;
    this.memberFilterRepository = memberFilterRepository;
  }

  @Override
  @Transactional
  public Mono<ResponseEntity<RecipeQueryRes>> handleRecipeQuery(RecipeQueryReq request) {

    // 1. 사용자 필터 정보 조회 단계 (MemberFilter 체크)
    Mono<MemberFilter> memberFilterMono = fetchMemberFilter(request.getMemberId());

    // 2. 식단 기반 재료 필터링 단계
    Mono<IngredientFilterService.FilteredIngredientResult> filteredIngredientsMono = filterIngredientsByDietaries(memberFilterMono, request.getIngredients());

    // 3. FastAPI 호출 단계
    return callFastApi(filteredIngredientsMono, memberFilterMono, request);
  }

  // 멤버-필터 체크 함수
  private Mono<MemberFilter> fetchMemberFilter(Long memberId) {
    return Mono.fromCallable(() -> memberFilterRepository.findByMemberId(memberId)
            .orElseThrow(() -> new RuntimeException("Member filter not found for memberId: " + memberId)))
        .subscribeOn(Schedulers.boundedElastic());
  }

  // 멤버-필터의 식단 설정에 따라 냉장고의 식재료들을 필터링합니다.
  private Mono<IngredientFilterService.FilteredIngredientResult> filterIngredientsByDietaries(Mono<MemberFilter> memberFilterMono, List<String> mainIngredients) {
    return memberFilterMono.flatMap(memberFilter ->
        Mono.fromCallable(() -> ingredientFilterService.filterIngredientsByDietaries(
                memberFilter.getFilterData().getDietaries(),
                mainIngredients,
                memberFilter.getFilterData().getAllergies()
            ))
            .subscribeOn(Schedulers.boundedElastic())
    );
  }

  // FastAPI를 호출해 레시피 검색 결과 응답을 받아옵니다.
  private Mono<ResponseEntity<RecipeQueryRes>> callFastApi(
      Mono<IngredientFilterService.FilteredIngredientResult> filteredIngredientsMono,
      Mono<MemberFilter> memberFilterMono,
      RecipeQueryReq request
  ) {
    return Mono.zip(filteredIngredientsMono, memberFilterMono)
        .flatMap(tuple -> {
          IngredientFilterService.FilteredIngredientResult result = tuple.getT1();
          MemberFilter memberFilter = tuple.getT2();

          Set<String> combinedPreferredIngredients = new HashSet<>(memberFilter.getFilterData().getPreferredIngredients());
          combinedPreferredIngredients.addAll(result.preferredIngredients());

          Map<String, Object> payload = new HashMap<>();
          payload.put("ingredients", result.ingredients());
          payload.put("main_ingredients", request.getIngredients());
          payload.put("preferred_ingredients", List.copyOf(combinedPreferredIngredients));
          payload.put("disliked_ingredients", memberFilter.getFilterData().getDislikedIngredients());
          payload.put("dietaries", memberFilter.getFilterData().getDietaries());
          payload.put("categories", memberFilter.getFilterData().getCategories());

          // 최종 요청 본문 확인
          log.info("🚩 Final Enhanced Payload: {}", payload);

          return webClient.post()
              .uri("/api/f1/query/")
              .contentType(MediaType.APPLICATION_JSON)
              .bodyValue(payload)
              .retrieve()
              .bodyToMono(String.class)
              .map(queryResConverter::convertToEntityAttribute);
        })
        .map(ResponseEntity::ok)
        .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)));
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
  public Mono<RecipeQueryCustomResponse> mapQueryResponse(ResponseEntity<RecipeQueryRes> responseEntity, Long memberId) {
    RecipeQueryRes queryRes = responseEntity.getBody();
    if (queryRes == null) {
      return Mono.error(new RuntimeException("Response body is null"));
    }

    return Flux.fromIterable(queryRes.getVideos().entrySet())
        .flatMap(entry -> {
          String dish = entry.getKey();
          List<VideoInfo> videoList = entry.getValue();
          return Flux.fromIterable(videoList)
              .flatMap(video -> convertVideoInfo(video, memberId))
              .collectList()
              .map(videoInfoList -> Tuples.of(dish, videoInfoList));
        })
        .collectMap(Tuple2::getT1, Tuple2::getT2)
        .map(videosMap -> RecipeQueryCustomResponse.builder()
            .dishes(queryRes.getDishes())
            .videos(videosMap)
            .build());
  }

  private Mono<VideoInfoCustomResponse> convertVideoInfo(VideoInfo video, Long memberId) {
    return Mono.fromCallable(() -> recipeRepository.findIdByYoutubeUrl(video.getUrl()))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(recipeId ->
            Mono.fromCallable(() -> memberRecipeRepository.findByMemberIdAndRecipeId(memberId, recipeId))
                .subscribeOn(Schedulers.boundedElastic())
                .map(optionalMemberRecipe -> {
                  Boolean favorite = false;
                  Integer rating = 0;
                  if (optionalMemberRecipe.isPresent()) {
                    MemberRecipe memberRecipe = optionalMemberRecipe.get();

                    favorite = Optional.ofNullable(memberRecipe.getFavorite()).orElse(false);
                    rating = Optional.ofNullable(memberRecipe.getRating()).orElse(0);
                  }
                  return VideoInfoCustomResponse.builder()
                      .recipeId(recipeId)
                      .title(video.getTitle())
                      .url(video.getUrl())
                      .channelTitle(video.getChannel_title())
                      .duration(video.getDuration())
                      .viewCount(video.getView_count())
                      .likeCount(video.getLike_count())
                      .favorite(favorite)
                      .rating(rating)
                      .build();
                })
        );
  }

  @Override
  @Transactional(readOnly = true)
  public Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes() {
    return Mono.fromCallable(recipeRepository::findAllWithIngredients)
        .subscribeOn(Schedulers.boundedElastic())
        .publishOn(Schedulers.parallel())
        .map(list -> list.stream()
            .map(RecipeDto::fromEntity)
            .collect(Collectors.toList()))
        .map(ResponseEntity::ok)
        .doOnNext(resp -> log.info("getAllRecipes result size={}", resp.getBody().size()))
        .doOnError(e -> log.error("getAllRecipes failed", e))
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

  @Override
  public Mono<RecipeDetailDto> getRecipeDetail(Long recipeId, RecipeExtractRes extractRes) {
    return Mono.fromCallable(() -> recipeRepository.findByIdWithIngredients(recipeId))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(optionalRecipe -> {
          if (optionalRecipe.isEmpty()) {
            return Mono.error(new NoRecipeException("Recipe not found"));
          }
          Recipe recipe = optionalRecipe.get();
          RecipeDetailDto dto = RecipeDetailDto.fromEntities(recipe, extractRes);
          return Mono.just(dto);
        });
  }

  @Override
  public Mono<RecipeDetailDto> getCurrentRecipeDetail(Long recipeId) {
    return Mono.fromCallable(() -> recipeRepository.findByIdWithIngredients(recipeId))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(optionalRecipe -> {
          if (optionalRecipe.isEmpty()) {
            return Mono.error(new NoRecipeException("Recipe not found"));
          }
          Recipe recipe = optionalRecipe.get();
          // textRecipe가 없으면 빈 RecipeExtractRes를 생성하거나 null을 사용 (DTO 설계에 따라 선택)
          RecipeExtractRes extractRes = recipe.getTextRecipe();
          RecipeDetailDto dto = RecipeDetailDto.fromEntities(recipe, extractRes);
          return Mono.just(dto);
        });
  }


}
