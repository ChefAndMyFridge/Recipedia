package com.recipidia.filter.service.impl;

import com.recipidia.filter.service.IngredientFilterService;
import com.recipidia.ingredient.dto.IngredientInfoWithNutrientDto;
import com.recipidia.ingredient.dto.IngredientNutrientDto;
import com.recipidia.ingredient.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class IngredientFilterServiceImpl implements IngredientFilterService {

  private static final Logger log = LoggerFactory.getLogger(IngredientFilterServiceImpl.class);
  private final IngredientService ingredientService;

  public List<String> filterIngredientsByDietaries(List<String> dietaries) {
    return ingredientService.getAllExistingIngredientsWithNutrients().stream()
        .filter(ingredient -> isIngredientSuitable(ingredient, dietaries))
        .map(IngredientInfoWithNutrientDto::name)
        .collect(Collectors.toList());
  }

  private boolean isIngredientSuitable(IngredientInfoWithNutrientDto ingredient, List<String> dietaries) {
    IngredientNutrientDto nutrients = ingredient.nutrients();
    String name = ingredient.name();

    if (nutrients == null) {
      log.warn("⚠️ '{}' 통과: nutrients 데이터가 없습니다 (null)", name);
      return true;  // null인 경우 포함하고 넘어감
    }

    double calories = nutrients.calories();


    if (calories <= 0) {
      log.warn("🚨 '{}' 제외: 칼로리 정보 없음 또는 0 이하 (calories={})", name, calories);
      return false;
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

//    double proteinRatio = (nutrients.protein() * 4 / calories) * 100;
//    if (dietaries.contains("고단백식") && proteinRatio < 12.0) {
//      log.info("❌ '{}' 제외 (고단백식 필터): 단백질 비율 {}% 미만", name, proteinRatio);
//      return false;
//    }

    double carbRatio = (nutrients.carbohydrate() * 4 / calories) * 100;
    if (dietaries.contains("저탄수화물식") && carbRatio > 45.0) {
      log.info("❌ '{}' 제외 (저탄수화물식 필터): 탄수화물 비율 {}% 초과", name, carbRatio);
      return false;
    }

    return true;
  }
}
