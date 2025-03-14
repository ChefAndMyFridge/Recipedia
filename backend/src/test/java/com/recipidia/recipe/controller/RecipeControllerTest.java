package com.recipidia.recipe.controller;

import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.IngredientQueryRes;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.service.RecipeService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
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

  // 필드 주입으로 의존성 주입 (생성자 주입 대신 @Autowired 사용)
  @org.springframework.beans.factory.annotation.Autowired
  private RecipeService recipeService;

  @org.springframework.beans.factory.annotation.Autowired
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
    // RecipeDto에 추가된 필드 channelTitle, duration, viewCount, likeCount를 함께 설정합니다.
    RecipeDto recipeDto = new RecipeDto(
        1L,
        "Test Recipe",
        "Test Title",
        "https://www.youtube.com/test",
        false, // hasTextRecipe
        List.of(), // ingredients (비어있음)
        "Test Channel",
        "10:00",
        1000L,
        100L
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
          // RecipeDto는 record이므로 accessor는 필드명() 형태로 호출
          assertThat(dto.recipeId()).isEqualTo(1L);
          assertThat(dto.name()).isEqualTo("Test Recipe");
          assertThat(dto.title()).isEqualTo("Test Title");
          assertThat(dto.youtubeUrl()).isEqualTo("https://www.youtube.com/test");
          assertThat(dto.hasTextRecipe()).isFalse();
          assertThat(dto.channelTitle()).isEqualTo("Test Channel");
          assertThat(dto.duration()).isEqualTo("10:00");
          assertThat(dto.viewCount()).isEqualTo(1000L);
          assertThat(dto.likeCount()).isEqualTo(100L);
        });
  }

  @Test
  public void testExtractAndSaveRecipe() {
    // RecipeExtractRes를 빌더로 생성합니다.
    // ingredients는 List<IngredientQueryRes>로 구성됨
    RecipeExtractRes extractRes = RecipeExtractRes.builder()
        .title("Extracted Recipe Title")
        .ingredients(List.of(
            new IngredientQueryRes("마늘", "2개(65g)"),
            new IngredientQueryRes("양파", "1개(40g)")
        ))
        .cooking_info(null)
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
          // ingredients는 이제 IngredientQueryRes 객체의 리스트이므로,
          // 각 객체의 getName() 메서드를 사용하여 검증합니다.
          List<String> ingredientNames = response.getIngredients().stream()
              .map(IngredientQueryRes::getName)
              .toList();
          assertThat(ingredientNames).containsExactly("마늘", "양파");
        });
  }
}
