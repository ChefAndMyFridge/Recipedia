package com.recipidia.user.service.impl;

import com.recipidia.user.dto.UserDto;
import com.recipidia.user.entity.User;
import com.recipidia.user.repository.UserRepository;
import com.recipidia.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  @Override
  @Transactional
  public UserDto createUser(String username) {
    // 필요에 따라 중복 체크 등 로직 추가
    User user = User.builder()
        .username(username)
        .build();
    user = userRepository.save(user);
    return UserDto.fromEntity(user);
  }

  @Override
  @Transactional
  public UserDto updateUsername(Long userId, String newUsername) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    // User 엔티티에 updateUsername 메서드가 있다고 가정
    user.updateUsername(newUsername);
    return UserDto.fromEntity(user);
  }

  @Override
  @Transactional
  public void deleteUser(Long userId) {
    userRepository.deleteById(userId);
  }

  @Override
  public List<UserDto> getAllUsers() {
    return userRepository.findAll().stream()
        .map(UserDto::fromEntity)
        .collect(Collectors.toList());
  }
}