package com.recipidia.member.service.impl;

import com.recipidia.member.dto.MemberDto;
import com.recipidia.member.entity.Member;
import com.recipidia.member.repository.MemberRepository;
import com.recipidia.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

  private final MemberRepository memberRepository;

  @Override
  @Transactional
  public MemberDto createUser(String username) {
    // 필요에 따라 중복 체크 등 로직 추가
    Member member = Member.builder()
        .username(username)
        .build();
    member = memberRepository.save(member);
    return MemberDto.fromEntity(member);
  }

  @Override
  @Transactional
  public MemberDto updateUsername(Long userId, String newUsername) {
    Member member = memberRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    // User 엔티티에 updateUsername 메서드가 있다고 가정
    member.updateUsername(newUsername);
    return MemberDto.fromEntity(member);
  }

  @Override
  @Transactional
  public void deleteUser(Long userId) {
    memberRepository.deleteById(userId);
  }

  @Override
  public List<MemberDto> getAllUsers() {
    return memberRepository.findAll().stream()
        .map(MemberDto::fromEntity)
        .collect(Collectors.toList());
  }
}