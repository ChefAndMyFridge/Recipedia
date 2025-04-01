package com.recipidia.auth.controller;

import com.recipidia.auth.dto.LoginRequest;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final AuthenticationManager authenticationManager;

  public AuthController(AuthenticationManager authenticationManager) {
    this.authenticationManager = authenticationManager;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
    // 아이디와 패스워드를 사용해 인증 토큰 생성
    UsernamePasswordAuthenticationToken authToken =
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

    // 인증 시도 (AuthenticationManager가 성공하면 Authentication 객체 반환)
    Authentication authentication = authenticationManager.authenticate(authToken);
    // SecurityContext에 인증 정보 저장
    SecurityContextHolder.getContext().setAuthentication(authentication);
    // 세션이 없으면 생성하고, JSESSIONID가 발급되도록 함
    request.getSession(true);

    return ResponseEntity.ok("로그인 성공");
  }
}
