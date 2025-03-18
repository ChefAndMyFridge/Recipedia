package com.recipidia.member.repository;

import com.recipidia.member.entity.Member;
import com.recipidia.member.entity.MemberRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRecipeRepository extends JpaRepository<MemberRecipe, Long> {
  Optional<MemberRecipe> findByMemberIdAndRecipeId(Long memberId, Long recipeId);
  List<MemberRecipe> findAllByMember(Member member);
}
