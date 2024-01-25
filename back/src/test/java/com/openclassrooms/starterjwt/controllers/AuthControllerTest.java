package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private Authentication  authentication;
    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserDetailsImpl userDetails;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthController authController;


    @Test
    void should_authenticate_user() {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@test.com");
        loginRequest.setPassword("password");

        User user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");
        user.setAdmin(false);
        user.setFirstName("user");

        user.setLastName("User");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        when(authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()))).thenReturn(authentication);

        when(jwtUtils.generateJwtToken(authentication)).thenReturn("token");

        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("user@test.com");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // When
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);
        // Then
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
    }

@Test
void should_not_authenticate_user() {
    when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException("Bad credentials!"));
    assertThatThrownBy(() -> authController.authenticateUser(new LoginRequest()))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Bad credentials!");
}

    @Test
    void shouldThrowException_whenNullCredentialsProvided() {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(null);
        loginRequest.setPassword(null);

        // Then
        assertThatThrownBy(() -> authController.authenticateUser(loginRequest))
                .isInstanceOf(NullPointerException.class);
    }

    @Test
    void should_register_user() {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("new_user@test.com");
        signupRequest.setPassword("password");
        signupRequest.setFirstName("new_user");
        signupRequest.setLastName("New_user");

        User user = new User();
        user.setId(5L);
        user.setEmail("new_user@test.com");
        user.setAdmin(false);
        user.setFirstName("new_user");
        user.setLastName("New_user");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        when(passwordEncoder.encode(signupRequest.getPassword())).thenReturn("password");
        when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(false);
        when(userRepository.save(new User(signupRequest.getEmail(), signupRequest.getLastName(), signupRequest.getFirstName(),  signupRequest.getPassword(), false))).thenReturn(user);
        // When
        ResponseEntity<?> response = authController.registerUser(signupRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(new MessageResponse("User registered successfully!"));
    }

    @Test
    void should_not_register_user_already_existing() {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("user@test.com");
        signupRequest.setPassword("password");
        signupRequest.setFirstName("user");
        signupRequest.setLastName("User");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // When
        ResponseEntity<?> response = authController.registerUser(signupRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(response.getBody()).isEqualTo(new MessageResponse("Error: Email is already taken!"));
    }
}