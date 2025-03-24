package com.recipidia.ingredient.repository.querydsl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.entity.QIngredient;
import com.recipidia.ingredient.entity.QIngredientInfo;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;

@Repository
public class IngredientQueryRepositoryImpl implements IngredientQueryRepository {

  private final JPAQueryFactory queryFactory;

  public IngredientQueryRepositoryImpl(JPAQueryFactory queryFactory) {
    this.queryFactory = queryFactory;
  }

  @Override
  public List<IngredientInfoDto> findAllExistingIngredients(Map<String, String> filterParam) {
    QIngredient ingredient = QIngredient.ingredient;
    QIngredientInfo ingredientInfo = QIngredientInfo.ingredientInfo;

    BooleanBuilder storageFilter = getStorageFilter(filterParam, ingredient);

    List<IngredientInfo> ingredientInfoList = queryFactory.selectFrom(ingredientInfo)
        .innerJoin(ingredientInfo.ingredients, ingredient)
        .fetchJoin()
        .where(ingredient.isReleased.eq(false).and(storageFilter))
        .fetch();

    return ingredientInfoList.stream()
        .map(IngredientInfoDto::fromEntity)
        .toList();
  }

  private static BooleanBuilder getStorageFilter(Map<String, String> filterParam,
      QIngredient ingredient) {
    BooleanBuilder whereClause = new BooleanBuilder();

    if (filterParam.containsKey("storage")) {
      String storage = filterParam.get("storage");
      switch (storage) {
        case "fridge":
          whereClause.and(ingredient.storagePlace.eq("fridge"));
          break;
        case "freezer":
          whereClause.and(ingredient.storagePlace.eq("freezer"));
          break;
        case "all":
          whereClause.and(Expressions.TRUE);
          break;
        default:
          throw new IllegalArgumentException("Invalid storage place: " + storage);
      }
    }
    return whereClause;
  }
}
