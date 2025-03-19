package com.recipidia.ingredient.scheduler;

import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.repository.IngredientRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class IngredientDeletionScheduler {

  private final IngredientRepository ingredientRepository;

  public IngredientDeletionScheduler(IngredientRepository ingredientRepository) {
    this.ingredientRepository = ingredientRepository;
  }

  // 매일 자정에 실행 (cron 표현식: 초, 분, 시, 일, 월, 요일)
  @Scheduled(cron = "0 0 0 * * *")
  @Transactional
  public void deleteOldReleasedIngredients() {
    LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
    List<Ingredient> oldReleasedIngredients = ingredientRepository
        .findByReleasingDateBeforeAndIsReleasedTrue(sevenDaysAgo);

    if (!oldReleasedIngredients.isEmpty()) {
      ingredientRepository.deleteAll(oldReleasedIngredients);
      // 필요 시 로깅 추가
      System.out.println("Deleted " + oldReleasedIngredients.size() + " ingredients released before " + sevenDaysAgo);
    }
  }
}
