package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDateTime;
import java.util.HashSet;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    private User user;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setPassword("password");
        user.setFirstName("User");
        user.setLastName("Test");
        user.setEmail("user@test.com");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));
        user.setUpdatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));
    }

    @Test
    void should_load_User_by_Username() {

        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail.getId()).isEqualTo(user.getId());
        assertThat(userFindByEmail.getUsername()).isEqualTo(user.getEmail());
        assertThat(userFindByEmail.getFirstName()).isEqualTo(user.getFirstName());

    }

    @Test
    void should_throw_exception_when_user_not_found() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.empty());

        // Then
        assertThatThrownBy(() -> userDetailsService.loadUserByUsername(user.getEmail()))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User Not Found with email: " + user.getEmail());
    }

    @Test
    void should_UserDetailsImpl_call_userDetailsBuilder() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail.getId()).isEqualTo(user.getId());
        assertThat(userFindByEmail.getUsername()).isEqualTo(user.getEmail());
        assertThat(userFindByEmail.getFirstName()).isEqualTo(user.getFirstName());

        assertThat(userFindByEmail).isEqualTo(
                UserDetailsImpl.builder()
                        .id(userFindByEmail.getId())
                        .username(userFindByEmail.getUsername())
                        .firstName(userFindByEmail.getFirstName())
                        .lastName(userFindByEmail.getLastName())
                        .password(userFindByEmail.getPassword())
                        .build());

    }

    @Test
    void should_return_true_when_two_UserDetails_is_equal() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail).isEqualTo(
                UserDetailsImpl.builder()
                        .id(userFindByEmail.getId())
                        .username(userFindByEmail.getUsername())
                        .firstName(userFindByEmail.getFirstName())
                        .lastName(userFindByEmail.getLastName())
                        .password(userFindByEmail.getPassword())
                        .build());
    }

    @Test
    void should_UserDetailsImpl_admin_attribute_is_null_when_User_is_admin_or_not() {
        // Given
        user.setAdmin(true);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail.getAdmin()).isNull();
    }

    @Test
    void should_UserDetailsImpl_isAccountNonExpired_attribute_is_true() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail.isAccountNonExpired()).isTrue();
    }

    @Test
    void should_UserDetailsImpl_isAccountNonLocked_attribute_is_true() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail.isAccountNonLocked()).isTrue();
    }

    @Test
    void should_UserDetailsImpl_isCredentialsNonExpired_attribute_is_true() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail.isCredentialsNonExpired()).isTrue();
    }

    @Test
    void should_UserDetailsImpl_isEnabled_attribute_is_true() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail.isEnabled()).isTrue();
    }

    @Test
    void should_UserDetailsImpl_getAuthorities_attribute_is_empty() {
        // Given
        when(userRepository.findByEmail(user.getEmail())).thenReturn(java.util.Optional.of(user));
        // When
        UserDetailsImpl userFindByEmail = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getEmail());
        // Then
        assertThat(userFindByEmail.getAuthorities()).isEqualTo(new HashSet<>());
    }

}