package com.recipidia.auth.config;

import com.recipidia.auth.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtUtilConfig {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration.ms}")
  private long jwtExpirationInMs;

  @Bean
  public JwtUtil jwtUtil() {
    return new JwtUtil(jwtSecret, jwtExpirationInMs);
  }
}

