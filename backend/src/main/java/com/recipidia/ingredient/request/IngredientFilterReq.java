package com.recipidia.ingredient.request;

import jakarta.validation.constraints.Pattern;
import java.util.Set;

// Set(입고, 출고) 디폴트는 전체 다 선택
// 재료 이름 검색 필터 String
// 정렬 필터 (과거순, 최신순) 디폴트는 최신순
public record IngredientFilterReq(
    Set<String> type,
    String name,
    @Pattern(regexp = "asc|desc", message = "sort 값은 asc나 desc만 가능합니다.") String sort) {

  private static final Set<String> ALLOWED_TYPES = Set.of("incoming", "releasing");

  // 오입력이 들어올경우 디폴트값으로 변경
  public IngredientFilterReq {
    if (type == null || !ALLOWED_TYPES.containsAll(type)) {
      type = ALLOWED_TYPES;
    }

    if (sort == null) {
      sort = "desc";
    }
  }
}
