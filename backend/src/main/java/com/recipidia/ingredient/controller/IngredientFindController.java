package com.recipidia.ingredient.controller;

import com.recipidia.ingredient.document.IngredientDocument;
import com.recipidia.ingredient.service.IngredientDocumentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ingredient")
@RequiredArgsConstructor
public class IngredientFindController {

  private final IngredientDocumentService ingredientDocumentService;

  @GetMapping("/search")
  public List<IngredientDocument> findAllIngredient() {
    return ingredientDocumentService.findAll();
  }
}
