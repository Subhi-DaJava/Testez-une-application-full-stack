package com.openclassrooms.starterjwt.security.jwt;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthEntryPointJwtTest {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private AuthenticationException authException;

    @Mock
    private ServletOutputStream outputStream;

    @Test
    void should_set_UnauthorizedStatus() throws ServletException, IOException {
        // Given
        when(response.getOutputStream()).thenReturn(outputStream);
        when(response.getStatus()).thenReturn(HttpServletResponse.SC_UNAUTHORIZED);

        // When
        authEntryPointJwt.commence(request, response, authException);

        // Then
        assertThat(HttpServletResponse.SC_UNAUTHORIZED).isEqualTo(401);
        assertThat(HttpServletResponse.SC_UNAUTHORIZED).isEqualTo(response.getStatus());
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    }
}