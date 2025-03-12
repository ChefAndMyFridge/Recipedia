package com.recipidia.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String username;

  // 만약 추가 기능(예: PIN, 잠금 상태 등)이 필요하다면 아래처럼 필드를 추가할 수 있습니다.
  // @Column
  // private String pin;
  //
  // @Column
  // private boolean isLocked;

  @Builder
  public User(String username) {
    this.username = username;
  }

  // 필요 시, 사용자 정보를 수정하는 전용 메서드를 추가할 수도 있습니다.
}
