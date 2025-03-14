package com.recipidia.recipe.service;

import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeExtractRes;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RecipeService {
    Mono<ResponseEntity<String>> handleRecipeQuery(RecipeQueryReq request);
    Mono<Void> saveRecipeResult(ResponseEntity<String> responseEntity);
    Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes();
    Mono<RecipeExtractRes> extractRecipe(Long recipeId);
    Mono<Void> saveExtractResult(Long recipeId, RecipeExtractRes extractRes);
}
