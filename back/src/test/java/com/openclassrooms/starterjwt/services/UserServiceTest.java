package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserService userService;

    @Test
    void should_delete_user() {
        // Given
        Long id = 1L;
        // When
        userService.delete(id);
        // Then
        verify(userRepository, times(1)).deleteById(id);
    }

    @Test
    void should_not_delete_user_non_existing() {
        // Given
        Long id = 1L;
        doThrow(new RuntimeException("User not found")).when(userRepository).deleteById(id);

        // Then
       assertThatThrownBy(() -> userService.delete(id))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void should_find_user_by_id() {
        // Given
        User user = new User();
        user.setId(1L);
        user.setEmail("john@gmail.com");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("123456");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.ofNullable(user));

        // When
        User userByIde = userService.findById(id);

        // Then
        verify(userRepository, times(1)).findById(id);
        assertThat(userByIde).isEqualTo(user);
    }

    @Test
    void should_not_find_user_by_id() {
        /*
        Since we rarely handle null values when dealing with Optional,
        Mockito now returns an empty Optional by default. That is the exact same value as the return of a call to Optional.empty().
         */
        // Given
        Long id = 1L;
      //when(userRepository.findById(id)).thenReturn(Optional.empty());
        // When
        User userByIde = userService.findById(id);

        // Then
        verify(userRepository, times(1)).findById(id);
        assertThat(userByIde).isNull();
        assertThat(userService.findById(id)).isNull();
    }



}