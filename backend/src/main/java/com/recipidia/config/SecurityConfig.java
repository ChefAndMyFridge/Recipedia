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
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 여기서 WebMvcConfigurer에 설정한 CORS 설정이 사용됩니다.
//        .csrf(csrf -> csrf
//            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//        ) // 쿠키에 csrf 토큰 붙이기
        .csrf(csrf -> csrf.disable()) // 일단 CORS 테스트 용으로 비활성화
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

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://j12s003.p.ssafy.io"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setMaxAge(3600L * 24);
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    // WebMvcConfigurer의 CORS 매핑과는 별도로 여기서도 설정해줘야 합니다.
    source.registerCorsConfiguration("/api/**", configuration);
    return source;
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
