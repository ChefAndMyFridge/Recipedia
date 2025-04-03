package com.recipidia.member.service.impl;


import com.recipidia.member.dto.MemberRecipeDto;
import com.recipidia.member.dto.RecipeWithMemberInfoDto;
import com.recipidia.member.entity.Member;
import com.recipidia.member.entity.MemberRecipe;
import com.recipidia.member.exception.MemberNotFoundException;
import com.recipidia.member.exception.RecipeNotFoundException;
import com.recipidia.member.repository.MemberRecipeRepository;
import com.recipidia.member.repository.MemberRepository;
import com.recipidia.member.service.MemberRecipeService;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberRecipeServiceImpl implements MemberRecipeService {
  private final MemberRepository memberRepository;
  private final RecipeRepository recipeRepository;
  private final MemberRecipeRepository memberRecipeRepository;

  @Override
  @Transactional
  public MemberRecipeDto patchMemberRecipe(Long memberId, Long recipeId, Integer rating, Boolean favorite) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException(recipeId));

    Optional<MemberRecipe> optMemberRecipe = memberRecipeRepository.findByMemberIdAndRecipeId(memberId, recipeId);
    MemberRecipe memberRecipe = optMemberRecipe.orElseGet(() -> {
      MemberRecipe newMemberRecipe = MemberRecipe.builder()
          .member(member)
          .recipe(recipe)
          .rating(rating)
          .favorite(favorite != null && favorite) // 기본 값 false
          .createdAt(LocalDateTime.now())
          .build();
      memberRecipeRepository.save(newMemberRecipe); // 새 객체 저장
      return newMemberRecipe;
    });

    if (rating != null) memberRecipe.updateRating(rating);
    if (favorite != null) memberRecipe.updateFavorite(favorite);

    return MemberRecipeDto.fromEntity(memberRecipe);
  }


  @Override
  @Transactional(readOnly = true)
  public List<MemberRecipeDto> getMemberRecipes(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + memberId));

    return memberRecipeRepository.findAllByMember(member)
        .stream()
        .map(MemberRecipeDto::fromEntity)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<RecipeWithMemberInfoDto> getMemberFavorites(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));

    return memberRecipeRepository.findAllByMemberAndFavoriteTrue(member)
        .stream()
        .map(mr -> RecipeWithMemberInfoDto.fromEntities(mr.getRecipe(), mr))
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<RecipeWithMemberInfoDto> getMemberRatedRecipes(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));

    return memberRecipeRepository.findAllByMemberAndRatingIsNotNull(member)
        .stream()
        .map(mr -> RecipeWithMemberInfoDto.fromEntities(mr.getRecipe(), mr))
        .toList();
  }

}
