package com.recipidia.ingredient.repository;

import com.recipidia.ingredient.entity.Ingredient;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

  @Modifying
  @Query("delete from Ingredient i where i.id in :deleteIds")
  void deleteBatchByIds(List<Long> deleteIds);
}
