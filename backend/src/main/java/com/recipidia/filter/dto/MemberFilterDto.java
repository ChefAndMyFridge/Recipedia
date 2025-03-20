package com.recipidia.filter.dto;

import com.recipidia.filter.entity.MemberFilter;

import java.io.Serializable;

/**
 * DTO for {@link MemberFilter}
 */
public record MemberFilterDto(
    Long id,
    Long memberId,
    MemberFilterData filterData
) implements Serializable {
  public static MemberFilterDto fromEntity(MemberFilter entity) {
    return new MemberFilterDto(
        entity.getId(),
        entity.getMember().getId(),
        entity.getFilterData()
    );
  }
}
