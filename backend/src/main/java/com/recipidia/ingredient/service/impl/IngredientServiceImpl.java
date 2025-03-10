package com.recipidia.ingredient.service.impl;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.dto.IngredientInfoWithNutrientDto;
import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.exception.IngredientDeleteException;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.repository.IngredientRepository;
import com.recipidia.ingredient.request.IngredientIncomingReq;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import com.recipidia.ingredient.response.IngredientIncomingRes;
import com.recipidia.ingredient.response.IngredientUpdateRes;
import com.recipidia.ingredient.service.IngredientService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IngredientServiceImpl implements IngredientService {

  private final IngredientInfoRepository ingredientInfoRepository;
  private final IngredientRepository ingredientRepository;

  @Override
  public List<IngredientInfoDto> getAllIngredients() {
    List<IngredientInfo> ingredientInfos = ingredientInfoRepository.findAllWithIngredients();
    return ingredientInfos.stream()
        .map(IngredientInfoDto::fromEntity)
        .toList();
  }

  @Override
  @Transactional
  public IngredientIncomingRes stockItem(IngredientIncomingReq request) {
    // 이름으로 재료를 검색. 있으면 해당 재료를 사용.
    IngredientInfo ingredientInfo = ingredientInfoRepository.findByName(request.getName())
        .orElseGet(() -> new IngredientInfo(request.getName(), request.getImageUrl()));

    // 개수만큼 추가
    List<Ingredient> ingredients = ingredientInfo.getIngredients();
    for (int i = 0; i < request.getAmount(); i++) {
      // 새로운 item 생성
      Ingredient ingredient = Ingredient.builder()
          .storagePlace(request.getStoragePlace())
          .expirationDate(request.getExpirationDate())
          .incomingDate(request.getIncomingDate())
          .ingredientInfo(ingredientInfo)
          .build();
      ingredients.add(ingredient);
    }

    // 만약 ingredientInfo가 새로 생성된 객체라면 save 호출
    if (ingredientInfo.getId() == null) { // 새로운 엔티티라면 ID가 null일 것
      ingredientInfoRepository.save(ingredientInfo);
    }

    // 저장: 새로운 냉장고거나 기존 냉장고에 item 추가된 상태 저장
    return IngredientIncomingRes.builder()
        .name(request.getName())
        .storagePlace(request.getStoragePlace())
        .expirationDate(request.getExpirationDate())
        .incomingDate(request.getIncomingDate())
        .amount(ingredients.size())
        .build();
  }

  @Override
  @Transactional
  public IngredientUpdateRes updateItem(Long itemId, IngredientUpdateReq updateDTO) {
    Ingredient ingredient = ingredientRepository.findById(itemId)
        .orElseThrow(() -> new RuntimeException("Item not found"));

    ingredient.modifyIngredientInfo(updateDTO);
    return IngredientUpdateRes.fromEntity(ingredient);
  }

  @Override
  @Transactional
  public Map<String, Integer> releaseItems(Long ingredientId, int quantity) {
    // column에 삭제됐다고만 추가, 즉 update
    IngredientInfo ingredientInfo = ingredientInfoRepository.findWithIngredients(ingredientId);

    // 오래전에 저장한거부터 삭제
    List<Ingredient> ingredients = ingredientInfo.getIngredients();

    List<Ingredient> remainIngredients = ingredients.stream()
        .filter(ingredient -> !ingredient.isReleased())
        .toList();

    // 리스트의 수량이 0이면 삭제예외 발생
    if (remainIngredients.isEmpty()) {
      throw new IngredientDeleteException("재료의 수량이 0개여서 삭제가 불가능합니다");
    }

    int startIdx = ingredients.indexOf(remainIngredients.get(0));

    List<Long> releaseIds = remainIngredients.stream()
        .map(Ingredient::getId)
        .limit(Math.min(quantity, remainIngredients.size())).toList();

    // 현재 시간을 기준으로 출고일을 지정함
    ingredientRepository.markReleasedByIds(releaseIds, LocalDateTime.now());

    int endIndex = Math.min(quantity, ingredients.size());
    int remainCount = ingredients.size() - endIndex;

    ingredients.subList(startIdx, endIndex).clear();

    return Map.of("remainCount", remainCount);
  }

  @Override
  public IngredientInfoDto getIngredient(Long ingredientId) {
    IngredientInfo ingredientInfo = ingredientInfoRepository.findWithIngredients(ingredientId);
    return IngredientInfoDto.fromEntity(ingredientInfo);
  }

  @Override
  @Transactional(readOnly = true)
  public IngredientInfoWithNutrientDto getIngredientInfoWithNutrients(Long id) {
    IngredientInfo ingredientInfo = ingredientInfoRepository.findWithIngredientsAndNutrients(id);
    return IngredientInfoWithNutrientDto.fromEntity(ingredientInfo);
  }
}
