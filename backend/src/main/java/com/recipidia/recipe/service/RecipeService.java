package com.recipidia.recipe.service;

import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RecipeService {
    Mono<ResponseEntity<String>> handleRecipeQuery(RecipeQueryReq request);
    Mono<Void> saveRecipeResult(ResponseEntity<String> responseEntity);
    Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes();
}
