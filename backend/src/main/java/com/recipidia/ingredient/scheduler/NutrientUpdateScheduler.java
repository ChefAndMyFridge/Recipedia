package com.recipidia.ingredient.scheduler;

import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.entity.IngredientNutrient;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.repository.IngredientNutrientRepository;
import com.recipidia.ingredient.response.IngredientNutrientRes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NutrientUpdateScheduler {

    private final IngredientInfoRepository ingredientInfoRepository;
    private final IngredientNutrientRepository nutrientRepository;
    private final WebClient webClient;

    // 매 정각(초 0, 분 0, 매시)에 실행
    @Scheduled(cron = "0 0 * * * *")
    public void updateMissingNutrients() {
        List<IngredientInfo> ingredientsWithoutNutrient = ingredientInfoRepository.findByIngredientNutrientsIsNull();
        for (IngredientInfo ingredient : ingredientsWithoutNutrient) {
            // 영양성분 정보가 비어있는 IngredinentInfo를 순회하며 업데이트
            updateNutrientForIngredient(ingredient);
        }
    }

    /**
     * 특정 식재료에 대해 영양성분 업데이트를 수행합니다.
     * 이미 영양성분이 등록된 경우는 업데이트하지 않습니다.
     *
     * @param ingredient 업데이트할 식재료
     */
    @Async
    public void updateNutrientForIngredient(IngredientInfo ingredient) {
        log.info("Starting async nutrient update for ingredient: {} on thread: {}", ingredient.getName(), Thread.currentThread().getName());
        try {
            if (ingredient.getIngredientNutrients() != null) {
                log.info("Ingredient {} already has nutrients, skipping update.", ingredient.getName());
                return;
            }
            IngredientNutrientRes response = fetchNutrientData(ingredient.getName());
            if (response != null) {
                IngredientNutrient nutrient = IngredientNutrient.builder()
                    .ingredientInfo(ingredient)
                    .calories(response.getCalories())
                    .carbohydrate(response.getCarbohydrate())
                    .protein(response.getProtein())
                    .fat(response.getFat())
                    .sodium(response.getSodium())
                    .sugars(response.getSugars())
                    .cholesterol(response.getCholesterol())
                    .saturatedFat(response.getSaturatedFat())
                    .unsaturatedFat(response.getUnsaturatedFat())
                    .transFat(response.getTransFat())
                    .allergenInfo(response.getAllergenInfo())
                    .build();
                nutrientRepository.save(nutrient);
                log.info("Successfully updated nutrients for ingredient: {}", ingredient.getName());
            } else {
                log.warn("No nutrient data found for ingredient: {}", ingredient.getName());
            }
        } catch (Exception e) {
            log.error("Error updating nutrient for ingredient: {}", ingredient.getName(), e);
        }
    }

    private IngredientNutrientRes fetchNutrientData(String ingredientName) {
        Map<String, String> payload = new HashMap<>();
        payload.put("ingredient_name", ingredientName);

        return webClient.post()
                .uri("/api/f1/nutrient/")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(IngredientNutrientRes.class)
                .block();
    }
}