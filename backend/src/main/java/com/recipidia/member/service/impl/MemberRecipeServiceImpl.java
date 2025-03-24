package com.recipidia.member.service.impl;


import com.recipidia.member.dto.MemberRecipeDto;
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
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberRecipeServiceImpl implements MemberRecipeService {
  private final MemberRepository memberRepository;
  private final RecipeRepository recipeRepository;
  private final MemberRecipeRepository memberRecipeRepository;

  @Override
  public MemberRecipeDto patchMemberRecipe(Long memberId, Long recipeId, Integer rating, Boolean favorite) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException(recipeId));

    MemberRecipe memberRecipe = memberRecipeRepository
        .findByMemberIdAndRecipeId(memberId, recipeId)
        .orElseGet(() -> MemberRecipe.builder()
            .member(member)
            .recipe(recipe)
            .rating(null)
            .favorite(false)
            .createdAt(LocalDateTime.now())
            .build()
        );

    if (rating != null && !rating.equals(memberRecipe.getRating())) {
      memberRecipe.updateRating(rating);
    }
    if (favorite != null && !favorite.equals(memberRecipe.getFavorite())) {
      memberRecipe.updateFavorite(favorite);
    }

    memberRecipeRepository.save(memberRecipe);
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
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<MemberRecipeDto> getMemberFavorites(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));
    return memberRecipeRepository.findAllByMemberAndFavoriteTrue(member)
        .stream().map(MemberRecipeDto::fromEntity).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<MemberRecipeDto> getMemberRatedRecipes(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));
    return memberRecipeRepository.findAllByMemberAndRatingIsNotNull(member)
        .stream().map(MemberRecipeDto::fromEntity).toList();
  }

}
