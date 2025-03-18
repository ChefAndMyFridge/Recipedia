package com.recipidia.member.service.impl;


import com.recipidia.member.dto.MemberRecipeDto;
import com.recipidia.member.entity.Member;
import com.recipidia.member.entity.MemberRecipe;
import com.recipidia.member.exception.RecipeNotFoundException;
import com.recipidia.member.exception.MemberNotFoundException;
import com.recipidia.member.repository.MemberRepository;
import com.recipidia.member.repository.MemberRecipeRepository;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.repository.RecipeRepository;
import com.recipidia.member.request.FavoriteReq;
import com.recipidia.member.request.RatingReq;
import com.recipidia.member.service.MemberRecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberRecipeServiceImpl implements MemberRecipeService {
  private final MemberRepository memberRepository;
  private final RecipeRepository recipeRepository;
  private final MemberRecipeRepository memberRecipeRepository;

  @Override
  public MemberRecipeDto rateRecipe(RatingReq request) {
    // 사용자와 레시피 엔티티 조회
    Member member = memberRepository.findById(request.userId())
        .orElseThrow(() -> new MemberNotFoundException(request.userId()));
    Recipe recipe = recipeRepository.findById(request.recipeId())
        .orElseThrow(() -> new RecipeNotFoundException(request.recipeId()));

    // 해당 사용자와 레시피의 UserRecipe 레코드가 존재하는지 확인
    Optional<MemberRecipe> optionalUserRecipe = memberRecipeRepository.findByUserIdAndRecipeId(member.getId(), recipe.getId());
    MemberRecipe memberRecipe;
    if (optionalUserRecipe.isPresent()) {
      // 기존 레코드가 있다면 별점만 업데이트
      memberRecipe = optionalUserRecipe.get();
      memberRecipe.updateRating(request.rating());
    } else {
      // 없으면 새로 생성 (즐겨찾기는 기본 false로 설정)
      memberRecipe = MemberRecipe.builder()
          .member(member)
          .recipe(recipe)
          .rating(request.rating())
          .favorite(false)
          .createdAt(LocalDateTime.now())
          .build();
    }
    memberRecipeRepository.save(memberRecipe);
    return MemberRecipeDto.fromEntity(memberRecipe);
  }

  @Override
  public MemberRecipeDto favoriteRecipe(FavoriteReq request) {
    // 사용자와 레시피 엔티티 조회
    Member member = memberRepository.findById(request.userId())
        .orElseThrow(() -> new MemberNotFoundException(request.userId()));
    Recipe recipe = recipeRepository.findById(request.recipeId())
        .orElseThrow(() -> new RecipeNotFoundException(request.recipeId()));

    // 해당 사용자와 레시피의 UserRecipe 레코드가 존재하는지 확인
    Optional<MemberRecipe> optionalUserRecipe = memberRecipeRepository.findByUserIdAndRecipeId(member.getId(), recipe.getId());
    MemberRecipe memberRecipe;
    if (optionalUserRecipe.isPresent()) {
      // 기존 레코드가 있다면 즐겨찾기 값만 업데이트
      memberRecipe = optionalUserRecipe.get();
      memberRecipe.updateFavorite(request.favorite());
    } else {
      // 없으면 새로 생성 (별점은 null로 설정)
      memberRecipe = MemberRecipe.builder()
          .member(member)
          .recipe(recipe)
          .rating(null)
          .favorite(request.favorite())
          .createdAt(LocalDateTime.now())
          .build();
    }
    memberRecipeRepository.save(memberRecipe);
    return MemberRecipeDto.fromEntity(memberRecipe);
  }

  @Override
  @Transactional(readOnly = true)
  public List<MemberRecipeDto> getUserRecipes(Long userId) {
    Member member = memberRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

    return memberRecipeRepository.findAllByUser(member)
        .stream()
        .map(MemberRecipeDto::fromEntity)
        .collect(Collectors.toList());
  }
}
