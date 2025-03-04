package com.recipidia.ingredient.controller;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.request.IngredientDeleteReq;
import com.recipidia.ingredient.request.IngredientIncomingReq;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import com.recipidia.ingredient.response.IngredientIncomingRes;
import com.recipidia.ingredient.response.IngredientUpdateRes;
import com.recipidia.ingredient.service.IngredientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ingredient")
@RequiredArgsConstructor
public class IngredientController {

  private final IngredientService ingredientService;

  // ID로 단일 재료 조회
  @GetMapping("/{ingredientId}")
  public IngredientInfoDto getIngredientInfo(@PathVariable Long ingredientId) {
    return ingredientService.getIngredient(ingredientId);
  }

  // 재료 입고: 재료가 존재하면 해당 재료에 item 추가, 없으면 새로 생성 후 item 추가
  @Operation(
      summary = "재료 입고",
      description = "FIGMA : OO 플로우 - [OOOO]",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "입고할 재료 정보",
          required = true,
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = IngredientIncomingReq.class),
              examples = {
                  @ExampleObject(
                      name = "요청 데이터",
                      value = """
                          {
                          "name": "대파",
                          "imageUrl": "https://image.com",
                          "amount": "3",
                          "storagePlace": "냉장고",
                          "expirationDate": "2025-03-08T11:00:00",
                          "incomingDate": "2025-03-01T12:00:00"
                          }
                          """
                  )
              }))
  )
  @PostMapping
  public IngredientIncomingRes stockItem(@RequestBody IngredientIncomingReq request) {
    return ingredientService.stockItem(request);
  }

  // 전체 재료 및 해당 item 목록 조회
  @GetMapping
  public List<IngredientInfoDto> getAllIngredients() {
    return ingredientService.getAllIngredients();
  }

  // item 수정
  @Operation(
      summary = "재료 정보 수정",
      description = "FIGMA : OO 플로우 - [OOOO]",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "수정할 재료 정보",
          required = true,
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = IngredientUpdateReq.class),
              examples = {
                  @ExampleObject(
                      name = "요청 데이터",
                      value = """
                          {
                          "storagePlace": "냉동실",
                          "expirationDate": "2025-03-07T11:00:00",
                          "incomingDate": "2025-03-02T12:00:00",
                          "releasingDate": "2025-03-05T12:00:00"
                          }
                          """
                  )
              }))
  )
  @PutMapping("/{itemId}")
  public IngredientUpdateRes updateItem(@PathVariable Long itemId,
      @RequestBody IngredientUpdateReq updateDTO) {
    return ingredientService.updateItem(itemId, updateDTO);
  }

  // item 삭제
  @Operation(
      summary = "재료 출고",
      description = "FIGMA : OO 플로우 - [OOOO]",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "출고할 재료 수량",
          required = true,
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = IngredientDeleteReq.class),
              examples = {
                  @ExampleObject(
                      name = "요청 데이터",
                      value = """
                          {
                          "quantity": "1"
                          }
                          """
                  )
              }))
  )
  @DeleteMapping("/{ingredientId}")
  public int deleteItem(@PathVariable Long ingredientId, @RequestBody IngredientDeleteReq deleteReq) {
    return ingredientService.deleteItem(ingredientId, deleteReq.quantity());
  }
}