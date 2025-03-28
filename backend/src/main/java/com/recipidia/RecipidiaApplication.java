package com.recipidia;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RecipidiaApplication {

	public static void main(String[] args) {
		SpringApplication.run(RecipidiaApplication.class, args);
	}

	@PostConstruct
	public void showDbUrl() {
		System.out.println("DB 접속 URL: " + System.getenv("MYSQL_HOST"));
	}
}
