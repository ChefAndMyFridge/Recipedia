package com.recipidia.member.service;

import com.recipidia.member.dto.MemberDto;

import java.util.List;

public interface MemberService {
  MemberDto createUser(String username);
  MemberDto updateUsername(Long userId, String newUsername);
  void deleteUser(Long userId);
  List<MemberDto> getAllUsers();
}