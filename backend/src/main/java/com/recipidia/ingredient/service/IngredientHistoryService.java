package com.recipidia.ingredient.service;

import com.recipidia.ingredient.request.IngredientFilterReq;
import com.recipidia.ingredient.response.IngredientHistoryResponse;
import java.util.List;

public interface IngredientHistoryService {
  // History
  List<IngredientHistoryResponse> getIngredientsHistory(IngredientFilterReq filterReq);
}
