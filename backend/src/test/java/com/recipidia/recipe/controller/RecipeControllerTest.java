package com.recipidia.recipe.controller;

import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.service.RecipeService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebFluxTest(controllers = RecipeController.class)
@Import(RecipeControllerTest.MockConfig.class)
public class RecipeControllerTest {

    @TestConfiguration
    static class MockConfig {
        @Bean
        public RecipeService recipeService() {
            return Mockito.mock(RecipeService.class);
        }
    }

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    public void testQueryRecipe() {
        RecipeQueryReq request = new RecipeQueryReq(List.of("돼지고기", "대파"));

        ResponseEntity<String> dummyResponse = ResponseEntity.ok("Dummy Query Response");
        when(recipeService.handleRecipeQuery(any(RecipeQueryReq.class)))
                .thenReturn(Mono.just(dummyResponse));
        when(recipeService.saveRecipeResult(dummyResponse))
                .thenReturn(Mono.empty());

        webTestClient.post()
                .uri("/api/v1/recipe")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .value(response -> assertThat(response).isEqualTo("Dummy Query Response"));
    }

    @Test
    public void testGetAllRecipes() {
        RecipeDto recipeDto = new RecipeDto(
                1L,
                "Test Recipe",
                "Test Title",
                "https://www.youtube.com/test",
                false,
                List.of()
        );
        List<RecipeDto> recipes = List.of(recipeDto);
        ResponseEntity<List<RecipeDto>> dummyResponse = ResponseEntity.ok(recipes);

        when(recipeService.getAllRecipes()).thenReturn(Mono.just(dummyResponse));

        webTestClient.get()
                .uri("/api/v1/recipe/check")
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(RecipeDto.class)
                .hasSize(1)
                .value(list -> {
                    RecipeDto dto = list.get(0);
                    assertThat(dto.recipeId()).isEqualTo(1L);
                    assertThat(dto.name()).isEqualTo("Test Recipe");
                    assertThat(dto.title()).isEqualTo("Test Title");
                    assertThat(dto.youtubeUrl()).isEqualTo("https://www.youtube.com/test");
                });
    }

    @Test
    public void testExtractAndSaveRecipe() {
        RecipeExtractRes extractRes = RecipeExtractRes.builder()
                .title("Extracted Recipe Title")
                .ingredients(List.of("마늘", "양파"))
                .cooking_info(null)
                .cooking_tools(null)
                .cooking_tips(null)
                .cooking_sequence(null)
                .build();

        Long recipeId = 1L;
        when(recipeService.extractRecipe(recipeId)).thenReturn(Mono.just(extractRes));
        when(recipeService.saveExtractResult(recipeId, extractRes)).thenReturn(Mono.empty());

        webTestClient.get()
                .uri("/api/v1/recipe/{recipeId}", recipeId)
                .exchange()
                .expectStatus().isOk()
                .expectBody(RecipeExtractRes.class)
                .value(response -> {
                    assertThat(response.getTitle()).isEqualTo("Extracted Recipe Title");
                    assertThat(response.getIngredients()).containsExactly("마늘", "양파");
                });
    }
}
