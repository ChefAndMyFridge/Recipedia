package com.recipidia.ingredient.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientHistoryResponse {
  private String name; // 재료 이름
  private String storagePlace; // 냉장고 or 냉동고
  private String actionType; // 입고 or 출고
  private LocalDateTime actionDate; // 입고날짜 or 출고날짜
  private int amount; // 수량
}
