package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {
    @Mock
    private UserMapper userMapper;
    @Mock
    private UserService userService;
    @Mock
    private Authentication authentication;
    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private UserController userController;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("johnDoe@test.com");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
    }


    @Test
    void should_find_user_by_userId() {
        //given
        UserDto userDto = new UserDto(1L,
                "johnDoe@test.com",
                "Doe",
                "John",
                false,
                "password",
                LocalDateTime.now(),
                LocalDateTime.now());
        when(userService.findById(1L)).thenReturn(user);
        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        //when
        ResponseEntity<?> response = userController.findById("1");
        //then

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(userDto);
        verify(userService, times(1)).findById(1L);
        verify(userMapper, times(1)).toDto(user);

    }

    @Test
    void should_not_find_user_by_userId() {
        //given
       // when(userService.findById(1L)).thenReturn(null);
        //when
        ResponseEntity<?> response = userController.findById("1");
        //then
        assertThat(response.getStatusCodeValue()).isEqualTo(404);
        verify(userService, times(1)).findById(1L);
        verify(userMapper, times(0)).toDto(user);
    }

    @Test
    void should_throw_exception_when_userId_is_not_a_number() {
        //given
        //when
        ResponseEntity<?> response = userController.findById("a");
        //then
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verify(userService, times(0)).findById(1L);
        verify(userMapper, times(0)).toDto(user);
    }

    @Test
    void should_delete_user_by_id() {
        // Given
        when(userService.findById(1L)).thenReturn(user);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("johnDoe@test.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        doNothing().when(userService).delete(1L);

        // When
        ResponseEntity<?> response = userController.deleteUserById("1");

        // Then
        Assertions.assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(userService, times(1)).delete(1L);
    }

    @Test
    void should_not_delete_user_by_id() {

        // When
        ResponseEntity<?> response = userController.deleteUserById("1");

        // Then
        verify(userService, times(0)).delete(1L);
        Assertions.assertThat(response.getStatusCodeValue()).isEqualTo(404);
        
    }

    @Test
    void should_not_delete_user_by_id_when_user_is_not_logged() {
        // Given
        User userLogged = new User();
        userLogged.setId(2L);
        userLogged.setAdmin(false);
        userLogged.setEmail("userLogged@test.com");
        userLogged.setLastName("Dupont");
        userLogged.setFirstName("Adrien");
        userLogged.setCreatedAt(LocalDateTime.now());
        userLogged.setUpdatedAt(LocalDateTime.now());

        when(userService.findById(1L)).thenReturn(user);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn(userLogged.getEmail());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // When
        ResponseEntity<?> response = userController.deleteUserById("1");

        // Then
        verify(userService, times(0)).delete(1L);
        Assertions.assertThat(response.getStatusCodeValue()).isEqualTo(401);
    }

    @Test
    void should_not_delete_user_by_id_when_userId_NAN() {
        ResponseEntity<?> response = userController.deleteUserById("a");
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }
}