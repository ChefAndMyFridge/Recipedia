package com.recipidia.filter.service.impl;

import com.recipidia.filter.service.IngredientFilterService;
import com.recipidia.ingredient.dto.IngredientInfoWithNutrientDto;
import com.recipidia.ingredient.dto.IngredientNutrientDto;
import com.recipidia.ingredient.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class IngredientFilterServiceImpl implements IngredientFilterService {

  private static final Logger log = LoggerFactory.getLogger(IngredientFilterServiceImpl.class);
  private final IngredientService ingredientService;

  @Override
  public FilteredIngredientResult filterIngredientsByDietaries(List<String> dietaries, List<String> mainIngredients, List<String> allergies) {
    Set<String> preferredIngredients = new HashSet<>();
    Set<String> mainIngredientsSet = new HashSet<>(mainIngredients); // 빠른 조회를 위해 Set으로 전환

    List<String> filteredIngredients = ingredientService.getAllExistingIngredientsWithNutrients().stream()
        .filter(ingredient -> isIngredientSuitable(ingredient, dietaries, preferredIngredients, mainIngredientsSet, allergies))
        .map(IngredientInfoWithNutrientDto::name)
        .collect(Collectors.toList());

    return new FilteredIngredientResult(filteredIngredients, preferredIngredients);
  }

  private boolean isIngredientSuitable(
      IngredientInfoWithNutrientDto ingredient,
      List<String> dietaries,
      Set<String> preferredIngredients,
      Set<String> mainIngredients,
      List<String> allergies
      ) {
    IngredientNutrientDto nutrients = ingredient.nutrients();
    String name = ingredient.name();

    // 메인 재료 무조건 유지
    if (mainIngredients.contains(name)) {
      log.info("✅ '{}' 유지 (메인 재료)", name);
      return true;
    }

    if (nutrients == null) {
      log.warn("⚠️ '{}' 통과: nutrients 데이터가 없습니다 (null)", name);
      return true;
    }

    // 🔍 알레르기 필터링 로직 추가
    String allergenInfo = nutrients.allergenInfo();
    if (allergenInfo != null && !allergenInfo.isBlank()) {
      for (String allergen : allergies) {
        if (allergenInfo.contains(allergen)) {
          log.info("❌ '{}' 제외 (알레르기 필터 '{}')", name, allergen);
          return false;
        }
      }
    }

    double calories = nutrients.calories();

    if (calories <= 0) {
      log.warn("🚨 '{}' 통과: 칼로리 정보 없음 또는 0 이하 (calories={})", name, calories);
      return true;
    }

    double sugarRatio = (nutrients.sugars() * 4 / calories) * 100;
    if (dietaries.contains("저당식") && sugarRatio > 50.0) {
      log.info("❌ '{}' 제외 (저당식 필터): 당 비율 {}% 초과", name, sugarRatio);
      return false;
    }

    double fatRatio = (nutrients.fat() * 9 / calories) * 100;
    if (dietaries.contains("저지방식") && fatRatio > 50.0) {
      log.info("❌ '{}' 제외 (저지방식 필터): 지방 비율 {}% 초과", name, fatRatio);
      return false;
    }

    double carbRatio = (nutrients.carbohydrate() * 4 / calories) * 100;
    if (dietaries.contains("저탄수화물식") && carbRatio > 45.0) {
      log.info("❌ '{}' 제외 (저탄수화물식 필터): 탄수화물 비율 {}% 초과", name, carbRatio);
      return false;
    }

    // 고단백식일 경우 preferred에 추가
    double proteinRatio = (nutrients.protein() * 4 / calories) * 100;
    if (dietaries.contains("고단백식") && proteinRatio >= 35.0) {
      log.info("💡 '{}' 선호 재료 추가 (고단백식): 단백질 비율 {}% 이상", name, proteinRatio);
      preferredIngredients.add(name);
    }

    return true;
  }
}