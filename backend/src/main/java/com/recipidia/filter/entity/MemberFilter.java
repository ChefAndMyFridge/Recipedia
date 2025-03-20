package com.recipidia.filter.entity;

import com.recipidia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class MemberFilter {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // Member와 1:1 연관관계 설정 (member_filter.member_id > member.id)
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false, unique = true)
  private Member member;

  // 선호/비선호 하는 장르 리스트 (예: 소고기, 돼지고기, 닭고기 등)
  @ElementCollection
  @CollectionTable(name = "member_filter_genres", joinColumns = @JoinColumn(name = "member_filter_id"))
  @Column(name = "genre")
  private List<String> genres;

  // 선호/비선호 하는 식습관 리스트 (예: 고단백, 채식 등)
  @ElementCollection
  @CollectionTable(name = "member_filter_dietaries", joinColumns = @JoinColumn(name = "member_filter_id"))
  @Column(name = "dietary")
  private List<String> dietaries;

  // 선호/비선호 하는 재료 리스트 (예: 가지, 피클 등)
  @ElementCollection
  @CollectionTable(name = "member_filter_ingredients", joinColumns = @JoinColumn(name = "member_filter_id"))
  @Column(name = "ingredient")
  private List<String> ingredients;

  @Builder
  public MemberFilter(Member member, List<String> genres, List<String> dietaries, List<String> ingredients) {
    this.member = member;
    this.genres = genres;
    this.dietaries = dietaries;
    this.ingredients = ingredients;
  }
}