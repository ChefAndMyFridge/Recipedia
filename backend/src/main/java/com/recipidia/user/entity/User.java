package com.recipidia.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "\"user\"") // H2 database 사용을 위한 "" 처리
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String username;

  // 추가된 부분 (양방향 관계 설정)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<UserRecipe> userRecipes = new ArrayList<>();

  @Builder
  public User(String username) {
    this.username = username;
  }

  public void updateUsername(String newUsername) {
    this.username = newUsername;
  }
}
