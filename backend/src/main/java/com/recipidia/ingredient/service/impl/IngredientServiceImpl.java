package com.recipidia.ingredient.service.impl;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.repository.IngredientRepository;
import com.recipidia.ingredient.request.IngredientIncomingReq;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import com.recipidia.ingredient.response.IngredientIncomingRes;
import com.recipidia.ingredient.response.IngredientUpdateRes;
import com.recipidia.ingredient.service.IngredientService;
import java.util.List;
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
  // 엔티티를 로딩하고 일부로 lazy loading된것을 초기화하는것보다
  // join fetch로 한 쿼리로 가져오는게 나음
  public List<IngredientInfoDto> getAllIngredients() {
    // LAZY 로딩된 items가 JSON 변환 시 초기화되도록 강제 로딩
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

    // 요것도 생성자로 만드는게 나음
//    item.setStoragePlace(request.getStoragePlace());
//    item.setExpirationDate(request.getExpirationDate());
//    item.setIncomingDate(request.getIncomingDate());
//    item.setReleasingDate(request.getReleasingDate());
//    item.setRefrigerator(ingredientInfo);

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

    // 변경 감지 이용
    ingredient.modifyIngredientInfo(updateDTO);
    return IngredientUpdateRes.fromEntity(ingredient);
    // 요것도
//    item.setStoragePlace(updateDTO.getStoragePlace());
//    item.setExpirationDate(updateDTO.getExpirationDate());
//    item.setIncomingDate(updateDTO.getIncomingDate());
//    item.setReleasingDate(updateDTO.getReleasingDate());

//    return ingredientRepository.save(item);
  }

  @Override
  @Transactional
  public int deleteItem(Long ingredientId, int quantity) {
    // 삭제할 item을 조회
    IngredientInfo ingredientInfo = ingredientInfoRepository.findWithIngredients(ingredientId);
    // 부모 엔티티의 컬렉션에서 해당 item 제거
//    ingredientInfo.getItems().remove(item);
    // 오래전에 저장한거부터 삭제
    // orphanRemoval이 있어서 이렇게 해도 됨
    List<Ingredient> ingredients = ingredientInfo.getIngredients();
    List<Long> deleteIds = ingredients.stream().map(Ingredient::getId).sorted().limit(Math.min(quantity, ingredients.size())).toList();

    ingredientRepository.deleteBatchByIds(deleteIds);
    ingredients.subList(0, Math.min(quantity, ingredients.size())).clear();

    return ingredients.size();
    // 만약 해당 Refrigerator에 남은 item이 없다면, Refrigerator도 삭제
    // IngredientInfo는 메타정보이기 떄문에 삭제 안해도된다고 생각
//    if (ingredientInfo.getItems().isEmpty()) {
//      ingredientInfoRepository.delete(ingredientInfo);
//    }
  }

  @Override
  public IngredientInfoDto getIngredient(Long ingredientId) {
    IngredientInfo ingredientInfo = ingredientInfoRepository.findWithIngredients(ingredientId);
    return IngredientInfoDto.fromEntity(ingredientInfo);
  }
}
