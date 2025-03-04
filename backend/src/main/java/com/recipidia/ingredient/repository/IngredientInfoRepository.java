package com.recipidia.ingredient.repository;

import com.recipidia.ingredient.entity.IngredientInfo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientInfoRepository extends JpaRepository<IngredientInfo, Long> {
    Optional<IngredientInfo> findByName(String name);

    @Query("select if from IngredientInfo if left join fetch if.ingredients")
    List<IngredientInfo> findAllWithIngredients();

    @Query("select if from IngredientInfo if left join fetch if.ingredients where if.id = :ingredientId")
    IngredientInfo findWithIngredients(Long ingredientId);
}
