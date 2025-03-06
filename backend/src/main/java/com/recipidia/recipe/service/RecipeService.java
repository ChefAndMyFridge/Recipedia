package com.recipidia.recipe.service;

import com.recipidia.recipe.request.RecipeQueryReq;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

public interface RecipeService {
    Mono<ResponseEntity<String>> handleRecipeQuery(RecipeQueryReq request);
}
