package com.recipidia.ingredient.repository.querydsl;

import static org.assertj.core.api.Assertions.assertThat;

import com.recipidia.config.QueryDslConfig;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.entity.IngredientInfo;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({IngredientQueryRepositoryImpl.class, QueryDslConfig.class})
class IngredientQueryRepositoryImplTest {

  @Autowired
  private EntityManager em;

  @Autowired
  private IngredientQueryRepositoryImpl ingredientQueryRepository;

  private IngredientInfo info;

  private void createIngredients(String storagePlace, IngredientInfo info, int count) {
    for (int i = 0; i < count; i++) {
      Ingredient ingredient = Ingredient.builder()
          .ingredientInfo(info)
          .storagePlace(storagePlace)
          .expirationDate(LocalDateTime.now().plusDays(7-i))
          .incomingDate(LocalDateTime.now())
          .build();
      em.persist(ingredient);
      info.getIngredients().add(ingredient);
    }
  }

  @BeforeEach
  void setUpData() {
    info = new IngredientInfo("대파", "");
    em.persist(info);
    createIngredients("fridge", info, 2);
    createIngredients("freezer", info, 3);
    em.flush();
    em.clear();
  }

  @Test
  void findAllExistingIngredientsForFridge() {
    Map<String, String> params = Map.of("storage", "fridge");
    List<IngredientInfoDto> result = ingredientQueryRepository.findAllExistingIngredients(params);

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getTotalCount()).isEqualTo(2);
  }

  @Test
  void findAllExistingIngredientsForFreezer() {
    Map<String, String> params = Map.of("storage", "freezer");
    List<IngredientInfoDto> result = ingredientQueryRepository.findAllExistingIngredients(params);

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getTotalCount()).isEqualTo(3);

  }

  @Test
  void findAllExistingIngredientsForAll() {
    Map<String, String> params = Map.of("storage", "all");
    List<IngredientInfoDto> result = ingredientQueryRepository.findAllExistingIngredients(params);

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getTotalCount()).isEqualTo(5);
  }
}
