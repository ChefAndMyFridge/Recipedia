package com.recipidia.ingredient.service;


import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.request.IngredientIncomingReq;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import com.recipidia.ingredient.response.IngredientIncomingRes;
import com.recipidia.ingredient.response.IngredientUpdateRes;
import java.util.List;

public interface IngredientService {
    List<IngredientInfoDto> getAllIngredients();
    IngredientInfoDto getIngredient(Long ingredientId);
    IngredientIncomingRes stockItem(IngredientIncomingReq request);
    IngredientUpdateRes updateItem(Long itemId, IngredientUpdateReq updateDTO);
    int deleteItem(Long itemId, int quantity);
}
