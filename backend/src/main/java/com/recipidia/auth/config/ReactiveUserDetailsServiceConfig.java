package com.recipidia.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;

@Configuration
public class ReactiveUserDetailsServiceConfig {

  @Bean
  public ReactiveUserDetailsService reactiveUserDetailsService() {
    PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    UserDetails admin = User.builder()
        .username("admin")
        // 실제 서비스 시 강력한 암호를 사용하세요.
        .password(encoder.encode("securityTest")) // 나중에 환경변수로 주입
        .roles("ADMIN")
        .build();
    return new MapReactiveUserDetailsService(admin);
  }
}
