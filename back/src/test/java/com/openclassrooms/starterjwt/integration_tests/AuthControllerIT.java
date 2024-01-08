package com.openclassrooms.starterjwt.integration_tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    private LoginRequest loginRequest;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String BASE_URL = "/api/auth";

    @BeforeEach
    public void setUpEach() {

        loginRequest = new LoginRequest();
        loginRequest.setEmail("subhi@test.com");
        loginRequest.setPassword("test!1234");

    }

    @Test
    void should_Return_200_When_Login_Is_Successful() throws Exception {
        mockMvc.perform(post(BASE_URL + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.lastName").exists())
                .andExpect(jsonPath("$.firstName").exists())
                .andExpect(jsonPath("$.admin").exists())
                .andExpect(jsonPath("$.admin").value(false));
    }

    @Test
    void should_Return_401_When_Login_Is_Unsuccessful() throws Exception {
        loginRequest.setPassword("wrongPassword");
        mockMvc.perform(post(BASE_URL + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Return_200_When_Admin_Login_Is_Successful() throws Exception {
        loginRequest.setEmail("yoga@studio.com");
        mockMvc.perform(post(BASE_URL + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.lastName").exists())
                .andExpect(jsonPath("$.firstName").exists())
                .andExpect(jsonPath("$.admin").exists())
                .andExpect(jsonPath("$.admin").value(true));
    }

    @Test
    void should_Return_401_When_Admin_Login_Is_Unsuccessful() throws Exception {

        loginRequest.setEmail("yoga@studio.com");
        loginRequest.setPassword("wrongPassword");

        mockMvc.perform(post(BASE_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Return_Success_Message_When_Register_Is_Successful() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("newUser@test.com");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");
        signupRequest.setPassword("test!1234");

        mockMvc.perform(post(BASE_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));

    }

    @Test
    void should_Return_Error_Message_When_Register_Is_Unsuccessful() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");

        mockMvc.perform(post(BASE_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_Return_Error_Message_Email_Is_Already_Taken() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("subhi@test.com");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");
        signupRequest.setPassword("test!1234");

        mockMvc.perform(post(BASE_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }


}
