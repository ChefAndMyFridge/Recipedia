package com.recipidia.ingredient.repository;

import com.recipidia.ingredient.document.IngredientDocument;
import java.util.List;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface IngredientDocumentRepository extends ElasticsearchRepository<IngredientDocument, Long> {
  List<IngredientDocument> findByName(String name);
}
