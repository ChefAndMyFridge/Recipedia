package com.recipidia.ingredient.service.impl;

import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.request.IngredientFilterReq;
import com.recipidia.ingredient.response.IngredientHistoryResponse;
import com.recipidia.ingredient.service.IngredientHistoryService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IngredientHistoryServiceImpl implements IngredientHistoryService {

  private final IngredientInfoRepository ingredientInfoRepository;

  private Comparator<LocalDateTime> setDateComparator(String sort) {
    return sort != null && sort.equalsIgnoreCase("DESC") ? Comparator.reverseOrder()
        : Comparator.naturalOrder();
  }

  @Override
  @Transactional(readOnly = true)
  public List<IngredientHistoryResponse> getIngredientsHistory(IngredientFilterReq filterReq) {
    List<IngredientInfo> ingredientInfos = ingredientInfoRepository.findAllWithIngredients();
    List<IngredientHistoryResponse> ingredientHistoryResponses = new ArrayList<>();

    for (String type : filterReq.type()) {
      switch (type) {
        case "incoming":
          ingredientHistoryResponses.addAll(getIncomingIngredientHistory(ingredientInfos));
          break;
        case "releasing":
          ingredientHistoryResponses.addAll(getReleasingIngredientHistory(ingredientInfos));
          break;
        default:
          break;
      }
    }

    // 기준에 따라 정렬
    ingredientHistoryResponses.sort(Comparator.comparing(IngredientHistoryResponse::getActionDate,
        setDateComparator(filterReq.sort())));
    return ingredientHistoryResponses;
  }

  private List<IngredientHistoryResponse> getIncomingIngredientHistory(
      List<IngredientInfo> ingredientInfos) {
    List<IngredientHistoryResponse> ingredientHistoryResponses = new ArrayList<>();
    for (IngredientInfo ingredientInfo : ingredientInfos) {
      List<Ingredient> ingredients = ingredientInfo.getIngredients();

      // 입고된 재료들을 날짜별로 그룹핑
      Map<LocalDateTime, List<Ingredient>> incomingIngredientMap = ingredients.stream()
          .collect(Collectors.groupingBy(Ingredient::getIncomingDate));

      for (Entry<LocalDateTime, List<Ingredient>> ingredientEntry : incomingIngredientMap.entrySet()) {
        IngredientHistoryResponse ingredientHistoryResponse = IngredientHistoryResponse.builder()
            .name(ingredientInfo.getName())
            .storagePlace(ingredientEntry.getValue().get(0).getStoragePlace())
            .actionType("입고")
            .actionDate(ingredientEntry.getKey())
            .amount(ingredientEntry.getValue().size())
            .build();
        ingredientHistoryResponses.add(ingredientHistoryResponse);
      }
    }
    return ingredientHistoryResponses;
  }

  private List<IngredientHistoryResponse> getReleasingIngredientHistory(
      List<IngredientInfo> ingredientInfos) {
    List<IngredientHistoryResponse> ingredientHistoryResponses = new ArrayList<>();

    for (IngredientInfo ingredientInfo : ingredientInfos) {
      // 출고된 재료들만 필터링
      List<Ingredient> releasingIngredients = ingredientInfo.getIngredients().stream()
          .filter(Ingredient::isReleased)
          .toList();

      // 출고된 재료들을 날짜별로 그룹핑
      Map<LocalDateTime, List<Ingredient>> releasingIngredientMap = releasingIngredients.stream()
          .collect(Collectors.groupingBy(Ingredient::getReleasingDate));

      for (Entry<LocalDateTime, List<Ingredient>> ingredientEntry : releasingIngredientMap.entrySet()) {
        IngredientHistoryResponse ingredientHistoryResponse = IngredientHistoryResponse.builder()
            .name(ingredientInfo.getName())
            .storagePlace(ingredientEntry.getValue().get(0).getStoragePlace())
            .actionType("출고")
            .actionDate(ingredientEntry.getKey())
            .amount(ingredientEntry.getValue().size())
            .build();
        ingredientHistoryResponses.add(ingredientHistoryResponse);
      }
    }
    return ingredientHistoryResponses;
  }
}
