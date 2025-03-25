package com.recipidia.filter.service;

import java.util.List;

public interface IngredientFilterService {
  List<String> filterIngredientsByDietaries(List<String> dietaries);
}
