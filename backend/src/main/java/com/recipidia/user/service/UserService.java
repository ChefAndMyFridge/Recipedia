package com.recipidia.user.service;

import com.recipidia.user.dto.UserDto;

import java.util.List;

public interface UserService {
  UserDto createUser(String username);
  UserDto updateUsername(Long userId, String newUsername);
  void deleteUser(Long userId);
  List<UserDto> getAllUsers();
}