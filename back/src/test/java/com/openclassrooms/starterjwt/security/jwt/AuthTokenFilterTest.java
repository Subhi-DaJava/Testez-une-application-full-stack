package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private UserDetailsServiceImpl userDetailsService;
    @Mock
    private HttpServletRequest request;
    @Mock
    private UserDetailsImpl userDetails;
    @Mock
    private FilterChain filterChain;
    @Mock
    private HttpServletResponse response;

    @Test
    void should_do_filter_internal_with_header_including_valid_token() throws ServletException, IOException {

        // Given
        String jwt = "valid_jwt";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(jwtUtils.validateJwtToken(jwt)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(jwt)).thenReturn("John@test.com");
        when(userDetailsService.loadUserByUsername("John@test.com")).thenReturn(userDetails);
        doNothing().when(filterChain).doFilter(request, response);

        // When

        authTokenFilter.doFilterInternal(request, response, filterChain);
        // Then

        assertThat(authTokenFilter).isNotNull();
        verify(request, times(1)).getHeader("Authorization");
        verify(jwtUtils, times(1)).validateJwtToken(jwt);
        verify(jwtUtils, times(1)).getUserNameFromJwtToken(jwt);
        verify(userDetailsService, times(1)).loadUserByUsername("John@test.com");
    }

    @Test
    void should_not_do_filter_with_empty_header() throws ServletException, IOException {
        // Given
        when(request.getHeader("Authorization")).thenReturn(" ");
        // When
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(request, times(1)).getHeader("Authorization");
        verify(filterChain, times(1)).doFilter(request, response);

    }

    @Test
    void should_throw_error_with_header_not_starting_with_Bearer() throws ServletException, IOException {
        // Given
        when(request.getHeader("Authorization")).thenReturn("invalid_jwt");
        // When
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(request, times(1)).getHeader("Authorization");
        verify(filterChain, times(1)).doFilter(request, response);

    }

    @Test
    void should_not_do_filter_with_null_header() throws ServletException, IOException {
        // Given
        when(request.getHeader("Authorization")).thenReturn(null);
        // When
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(request, times(1)).getHeader("Authorization");
        verify(filterChain, times(1)).doFilter(request, response);
    }
}