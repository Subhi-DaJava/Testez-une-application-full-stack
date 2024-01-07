package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.controllers.UserController;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class SpringBootSecurityJwtApplicationTests {
	@MockBean
	private UserController userController;

	@Test
	void contextLoads() {
		assertThat(userController).isNotNull();
	}
}
