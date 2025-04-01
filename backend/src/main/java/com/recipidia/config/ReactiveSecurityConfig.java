package com.recipidia.config;

import com.recipidia.auth.jwt.JwtAuthenticationWebFilter;
import com.recipidia.auth.jwt.JwtUtil;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
public class ReactiveSecurityConfig {

  private final ReactiveUserDetailsService reactiveUserDetailsService;
  private final JwtUtil jwtUtil;

  public ReactiveSecurityConfig(ReactiveUserDetailsService reactiveUserDetailsService, JwtUtil jwtUtil) {
    this.reactiveUserDetailsService = reactiveUserDetailsService;
    this.jwtUtil = jwtUtil;
  }

  @Bean
  public SecurityWebFilterChain reactiveSecurityWebFilterChain(ServerHttpSecurity http, JwtAuthenticationWebFilter jwtFilter) {
    http
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .cors(cors -> cors.configurationSource(reactiveCorsConfigurationSource()))
        .authorizeExchange(exchange -> exchange
            .pathMatchers("/api/v1/recipe/**").authenticated()
            .anyExchange().permitAll()
        )
        .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
        .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable);

    return http.build();
  }

  @Bean
  public JwtAuthenticationWebFilter jwtAuthenticationWebFilter() {
    return new JwtAuthenticationWebFilter(jwtUtil, reactiveUserDetailsService);
  }

  @Bean
  public CorsConfigurationSource reactiveCorsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://j12s003.p.ssafy.io"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowCredentials(true);
    config.setMaxAge(3600L * 24);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}
