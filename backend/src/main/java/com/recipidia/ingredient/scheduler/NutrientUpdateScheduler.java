package com.recipidia.ingredient.scheduler;

import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.entity.IngredientNutrient;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.repository.IngredientNutrientRepository;
import com.recipidia.ingredient.response.IngredientNutrientRes;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class NutrientUpdateScheduler {

    private final IngredientInfoRepository ingredientInfoRepository;
    private final IngredientNutrientRepository nutrientRepository;
    private final WebClient webClient;

    public NutrientUpdateScheduler(IngredientInfoRepository ingredientInfoRepository,
                                   IngredientNutrientRepository nutrientRepository,
                                   WebClient.Builder webClientBuilder) {
        this.ingredientInfoRepository = ingredientInfoRepository;
        this.nutrientRepository = nutrientRepository;
        this.webClient = webClientBuilder.baseUrl("http://my-fastapi:8000").build();
    }

    // 매 정각(초 0, 분 0, 매시)에 실행
    @Scheduled(cron = "0 0 * * * *")
    public void updateMissingNutrients() {
        List<IngredientInfo> ingredientsWithoutNutrient = ingredientInfoRepository.findByIngredientNutrientsIsNull();
        for (IngredientInfo ingredient : ingredientsWithoutNutrient) {
            try {
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
                            .allergenInfo(response.getAllergenInfo())  // 이제 응답 값에서 받아옴
                            .build();
                    nutrientRepository.save(nutrient);
                }
            } catch (Exception e) {
                log.error("Error updating nutrient for ingredient: {}", ingredient.getName(), e);
            }
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