package com.recipidia.filter.dto;

import com.recipidia.filter.entity.MemberFilter;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link MemberFilter}
 */
public record MemberFilterDto(Long id, Long memberId, List<String> genres, List<String> dietaries, List<String> ingredients) implements Serializable {
  public static MemberFilterDto fromEntity(MemberFilter filter) {
    return new MemberFilterDto(
        filter.getId(),
        filter.getMember().getId(),
        filter.getGenres(),
        filter.getDietaries(),
        filter.getIngredients()
    );
  }
}