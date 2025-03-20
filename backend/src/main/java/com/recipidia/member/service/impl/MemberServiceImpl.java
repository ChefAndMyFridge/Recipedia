package com.recipidia.member.service.impl;

import com.recipidia.filter.dto.MemberFilterData;
import com.recipidia.filter.entity.MemberFilter;
import com.recipidia.filter.repository.MemberFilterRepository;
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
  private final MemberFilterRepository memberFilterRepository;

  @Override
  @Transactional
  public MemberDto createMember(String membername) {
    // 필요에 따라 중복 체크 등 로직 추가
    Member member = Member.builder()
        .membername(membername)
        .build();
    member = memberRepository.save(member);

    // 새로 생성된 멤버에 대해 기본 빈 필터 데이터를 가진 MemberFilter 생성
    MemberFilterData filterData = MemberFilterData.builder()
        .preferredGenres(List.of())
        .dislikedGenres(List.of())
        .preferredDietaries(List.of())
        .dislikedDietaries(List.of())
        .preferredIngredients(List.of())
        .dislikedIngredients(List.of())
        .build();

    MemberFilter memberFilter = MemberFilter.builder()
        .member(member)
        .filterData(filterData)
        .build();
    memberFilterRepository.save(memberFilter);

    return MemberDto.fromEntity(member);
  }


  @Override
  @Transactional
  public MemberDto updateMembername(Long memberId, String newMembername) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new RuntimeException("Member not found"));
    // Member 엔티티에 updateMembername 메서드가 있다고 가정
    member.updateMembername(newMembername);
    return MemberDto.fromEntity(member);
  }

  @Override
  @Transactional
  public void deleteMember(Long memberId) {
    memberRepository.deleteById(memberId);
  }

  @Override
  public List<MemberDto> getAllMembers() {
    return memberRepository.findAll().stream()
        .map(MemberDto::fromEntity)
        .collect(Collectors.toList());
  }
}