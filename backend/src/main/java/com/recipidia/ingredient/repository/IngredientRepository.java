package com.recipidia.ingredient.repository;

import com.recipidia.ingredient.entity.Ingredient;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

  @Modifying
  @Query("update Ingredient i set i.isReleased = true, i.releasingDate = :releaseDate where i.id in :ingredientIds")
  void markReleasedByIds(List<Long> ingredientIds, LocalDateTime releaseDate);

}
