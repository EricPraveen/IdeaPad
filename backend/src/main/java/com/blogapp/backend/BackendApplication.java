package com.blogapp.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		if (dotenv.get("DB_URL") == null) {
			dotenv = Dotenv.configure().directory("./backend/backend").ignoreIfMissing().load();
		}
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		SpringApplication.run(BackendApplication.class, args);
	}

}
