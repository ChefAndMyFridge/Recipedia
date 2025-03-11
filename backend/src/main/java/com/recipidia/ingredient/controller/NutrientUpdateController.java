package com.recipidia.ingredient.controller;

import com.recipidia.ingredient.scheduler.NutrientUpdateScheduler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class NutrientUpdateController {

    private final NutrientUpdateScheduler nutrientUpdateScheduler;

    public NutrientUpdateController(NutrientUpdateScheduler nutrientUpdateScheduler) {
        this.nutrientUpdateScheduler = nutrientUpdateScheduler;
    }

    @GetMapping("/update_nutrients")
    public ResponseEntity<String> triggerNutrientUpdate() {
        try {
            // 스케줄러 작업을 즉시 실행
            nutrientUpdateScheduler.updateMissingNutrients();
            return new ResponseEntity<>("Nutrient update job executed successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to execute nutrient update job: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
