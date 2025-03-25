package com.recipidia.ingredient.service.impl;

import com.recipidia.ingredient.document.IngredientDocument;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.dto.IngredientInfoWithNutrientDto;
import com.recipidia.ingredient.dto.IngredientSimpleInfoDto;
import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.exception.IngredientDeleteException;
import com.recipidia.ingredient.repository.IngredientDocumentRepository;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.repository.IngredientRepository;
import com.recipidia.ingredient.repository.querydsl.IngredientQueryRepository;
import com.recipidia.ingredient.request.IngredientIncomingReq;
import com.recipidia.ingredient.request.IngredientMultipleDeleteReq;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import com.recipidia.ingredient.response.IngredientIncomingRes;
import com.recipidia.ingredient.response.IngredientUpdateRes;
import com.recipidia.ingredient.service.IngredientService;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IngredientServiceImpl implements IngredientService {

  private final IngredientInfoRepository ingredientInfoRepository;
  private final IngredientRepository ingredientRepository;
  private final IngredientDocumentRepository ingredientDocumentRepository;

  // queryDSL
  private final IngredientQueryRepository ingredientQueryRepository;

  @Override
  public List<IngredientSimpleInfoDto> getAllIngredientInfo() {
    List<IngredientInfo> ingredientInfos = ingredientInfoRepository.findAll();
    return ingredientInfos.stream()
        .map(IngredientSimpleInfoDto::fromEntity)
        .toList();
  }

  @Override
  public List<IngredientInfoDto> findAllExistingIngredients(Map<String, String> filterParam) {
    return ingredientQueryRepository.findAllExistingIngredients(filterParam);
  }

  @Override
  @Transactional(readOnly = true)
  public List<IngredientInfoDto> getAllExistingIngredients() {
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
      // ingredientInfo에 대한 Nutrient 정보를 추가해야함
      ingredientInfoRepository.save(ingredientInfo);
      // Elasctic Search index에 추가
      ingredientDocumentRepository.save(IngredientDocument.fromEntity(ingredientInfo));
    }

    // 미출고 재료의 개수 계산 (isReleased가 false인 것들만)
    int validCount = (int) ingredients.stream()
        .filter(ingredient -> !ingredient.isReleased())
        .count();

    // 저장: 새로운 재료거나 기존 재료에 item 추가된 상태 저장 후 응답
    return IngredientIncomingRes.builder()
        .name(request.getName())
        .storagePlace(request.getStoragePlace())
        .expirationDate(request.getExpirationDate())
        .incomingDate(request.getIncomingDate())
        .amount(validCount)
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

    // 요청한 수량과 남은 재료 수 중 작은 값을 사용
    int validQuantity = Math.min(quantity, remainIngredients.size());

    // 출고할 재료 목록: 가장 오래된 미출고 재료부터 validQuantity 개 선택
    List<Ingredient> toRelease = remainIngredients.subList(0, validQuantity);
    List<Long> releaseIds = toRelease.stream()
        .map(Ingredient::getId)
        .toList();

    // 현재 시간으로 출고 처리 (DB update)
    ingredientRepository.markReleasedByIds(releaseIds, LocalDateTime.now());

    // 출고된 재료들을 ingredients 컬렉션에서 제거
    ingredients.removeAll(toRelease);

    // 남은 미출고 재료의 수를 새로 계산
    int remainCount = (int) ingredients.stream()
        .filter(i -> !i.isReleased())
        .count();

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

  @Override
  @Transactional
  public Map<String, Integer> releaseMultipleItems(List<IngredientMultipleDeleteReq> requests) {
    Map<String, Integer> remainCounts = new HashMap<>();

    for (IngredientMultipleDeleteReq req : requests) {
      // 이름으로 재료 조회
      IngredientInfo ingredientInfo = ingredientInfoRepository.findByName(req.name())
          .orElseThrow(() -> new IngredientDeleteException("재료 " + req.name() + " 가 존재하지 않습니다."));

      // 기존 단일 출고 메서드 재활용
      Map<String, Integer> result = releaseItems(ingredientInfo.getId(), req.quantity());
      remainCounts.put(req.name(), result.get("remainCount"));
    }
    return remainCounts;
  }

  @Override
  @Transactional(readOnly = true)
  public List<IngredientInfoWithNutrientDto> getAllExistingIngredientsWithNutrients() {
    List<IngredientInfo> ingredientInfos = ingredientInfoRepository.findAllExistingWithIngredientsAndNutrients();
    return ingredientInfos.stream()
        .map(IngredientInfoWithNutrientDto::fromEntity)
        .collect(Collectors.toList());
  }
}
