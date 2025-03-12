package com.recipidia.user.controller;

import com.recipidia.user.dto.UserDto;
import com.recipidia.user.request.CreateUserReq;
import com.recipidia.user.request.UpdateUsernameReq;
import com.recipidia.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  // 사용자 등록: username을 받아 새로운 User 생성
  @PostMapping
  public ResponseEntity<UserDto> createUser(@RequestBody CreateUserReq request) {
    UserDto userDto = userService.createUser(request.username());
    return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
  }

  // 사용자 이름 수정: userId 경로 변수와 새 이름을 받아서 업데이트
  @PutMapping("/{userId}")
  public ResponseEntity<UserDto> updateUsername(@PathVariable Long userId,
                                                @RequestBody UpdateUsernameReq request) {
    UserDto userDto = userService.updateUsername(userId, request.newUsername());
    return ResponseEntity.ok(userDto);
  }

  // 사용자 삭제: userId를 받아서 삭제
  @DeleteMapping("/{userId}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
    userService.deleteUser(userId);
    return ResponseEntity.noContent().build();
  }

  // 유저 목록 조회: 전체 사용자 목록을 반환
  @GetMapping
  public ResponseEntity<List<UserDto>> getAllUsers() {
    List<UserDto> users = userService.getAllUsers();
    return ResponseEntity.ok(users);
  }
}
