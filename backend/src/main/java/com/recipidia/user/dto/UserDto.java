package com.recipidia.user.dto;

import com.recipidia.user.entity.User;

import java.io.Serializable;

/**
 * DTO for {@link User}
 */
public record UserDto(Long userId, String username) implements Serializable {

  public static UserDto fromEntity(User user) {
    return new UserDto(
        user.getId(),
        user.getUsername()
    );
  }
}
