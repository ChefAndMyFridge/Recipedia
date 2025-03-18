package com.recipidia.member.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MemberNotFoundException extends RuntimeException {
  public MemberNotFoundException(Long userId) {
    super("User not found with id: " + userId);
  }
}