package com.recipidia.member.dto;

import com.recipidia.member.entity.Member;

import java.io.Serializable;

/**
 * DTO for {@link Member}
 */
public record MemberDto(Long userId, String username) implements Serializable {

  public static MemberDto fromEntity(Member member) {
    return new MemberDto(
        member.getId(),
        member.getUsername()
    );
  }
}
