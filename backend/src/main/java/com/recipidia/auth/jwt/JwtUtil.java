package com.recipidia.auth.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JwtUtil {

  private final SecretKey key;
  private final long jwtExpirationInMs;

  // 생성자에서 secret과 만료시간을 주입받음
  public JwtUtil(String secret, long jwtExpirationInMs) {
    // secret 값을 바이트 배열로 변환하여 SecretKey 생성
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.jwtExpirationInMs = jwtExpirationInMs;
  }

  // JWT 토큰 생성
  public String generateToken(String username) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(key, SignatureAlgorithm.HS512)
        .compact();
  }

  // Bearer 뒷부분 추출 (필요한 경우)
  public String extractToken(String bearerToken) {
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }

  // JWT 토큰에서 사용자 이름 추출
  public String getUsernameFromJWT(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  // JWT 토큰 유효성 검증
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    } catch (Exception ex) {
      // 토큰 만료, 변조 등의 예외 처리 (예: 로그 남기기)
    }
    return false;
  }
}
