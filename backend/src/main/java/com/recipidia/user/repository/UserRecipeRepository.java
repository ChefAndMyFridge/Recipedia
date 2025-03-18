package com.recipidia.user.repository;

import com.recipidia.user.entity.User;
import com.recipidia.user.entity.UserRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRecipeRepository extends JpaRepository<UserRecipe, Long> {
  Optional<UserRecipe> findByUserIdAndRecipeId(Long userId, Long recipeId);
  List<UserRecipe> findAllByUser(User user);
}
