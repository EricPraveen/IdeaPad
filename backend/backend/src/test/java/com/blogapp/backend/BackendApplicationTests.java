package com.blogapp.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	static {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		if (dotenv.get("DB_URL") == null) {
			dotenv = Dotenv.configure().directory("./backend/backend").ignoreIfMissing().load();
		}
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
	}

	@Test
	void contextLoads() {
	}

}
