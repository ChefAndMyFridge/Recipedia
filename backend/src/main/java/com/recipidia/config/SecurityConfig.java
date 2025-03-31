package com.recipidia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            // /error는 인증 없이 접근 가능하도록 설정
            .requestMatchers("/error").permitAll()
            // 나머지 요청은 인증 필요
            .anyRequest().authenticated()
        )
        // 기본 로그인 페이지 사용
        .formLogin(withDefaults())
        .logout(logout -> logout.permitAll());

    return http.build();
  }


  // In-Memory 방식으로 admin 계정 생성
  @Bean
  public UserDetailsService userDetailsService(PasswordEncoder encoder) {
    UserDetails admin = User.builder()
        .username("admin")
        // 실제 서비스 시 강력한 암호를 사용하세요.
        .password(encoder.encode("securityTest")) // 나중에 환경변수로 주입
        .roles("ADMIN")
        .build();
    return new InMemoryUserDetailsManager(admin);
  }

  // BCryptPasswordEncoder를 사용한 PasswordEncoder 빈 등록
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
