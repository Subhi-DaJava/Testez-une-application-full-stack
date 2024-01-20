package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)

class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    private String jwtSecret;
    private int jwtExpirationMs;

    @BeforeEach
    void setUp() {
        jwtSecret = "Token_Signature";
        jwtExpirationMs = 5 * 60 * 1000;
        /*
        In this code, ReflectionTestUtils.setField is used to set the jwtSecret and
        jwtExpirationMs fields in the jwtUtils object. This should resolve the issue with the jwtSecret being null.
         */
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "Token_Signature");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 5 * 60 * 1000);
    }

    @Test
    void should_generate_JwtToken_for_lambda_user() {
        // Given
        UserDetails userDetailsImpl = new UserDetailsImpl(
                1L,
                "John@test.com",
                "John",
                "Doe",
                false,
                "login_password"
        );
        when(authentication.getPrincipal()).thenReturn(userDetailsImpl);

        // When
        String jwtToken = jwtUtils.generateJwtToken(authentication);

        // Then
        assertThat(jwtToken).isNotNull();

        String generatedJwtToken = generateJWTToken(userDetailsImpl);
        // asserts the first part of the token (header)
        assertThat(generatedJwtToken.split("\\.")[0]).isEqualTo(jwtToken.split("\\.")[0]);
    }

    @Test
    void should_generate_JwtToken_for_admin_user() {
        // Given
        UserDetails userDetailsImpl = new UserDetailsImpl(
                2L,
                "yoga@admin.com",
                "Yoga",
                "Admin",
                true,
                "admin_password"
        );
        when(authentication.getPrincipal()).thenReturn(userDetailsImpl);

        // When
        String jwtToken = jwtUtils.generateJwtToken(authentication);

        // Then
        assertThat(jwtToken).isNotNull();

        String generatedJwtToken = generateJWTToken(userDetailsImpl);

        assertThat(generatedJwtToken.split("\\.")[0]).isEqualTo(jwtToken.split("\\.")[0]);
    }

    @Test
    void should_not_generate_JwtToken_for_null_user() {
        // Given
        when(authentication.getPrincipal()).thenReturn(null);

        // Then
        assertThatThrownBy(() -> jwtUtils.generateJwtToken(authentication));
    }

    @Test
    void should_get_UserName_from_JwtToken() {
        // Given
        UserDetails userDetailsImpl = new UserDetailsImpl(
                1L,
                "John@test.com",
                "John",
                "Doe",
                false,
                "login_password"
        );

        // When
        String jwtToken = generateJWTToken(userDetailsImpl);
        String subject = jwtUtils.getUserNameFromJwtToken(jwtToken);

        // Then
        assertThat(subject).isEqualTo(userDetailsImpl.getUsername());

    }

    @Test
    void should_validate_JwtToken() {
        // Given
        UserDetails userDetailsImpl = new UserDetailsImpl(
                1L,
                "John@test.com",
                "John",
                "Doe",
                false,
                "login_password"
        );
        String jwtToken = generateJWTToken(userDetailsImpl);
        // When
        boolean isValid = jwtUtils.validateJwtToken(jwtToken);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    void should_catch_SignatureException() {
        // Given
        String tokenWithWrongSignature = Jwts.builder()
                .setSubject("John@test.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, "wrong_signature")
                .compact();

        // When
        boolean isValidSignature = jwtUtils.validateJwtToken(tokenWithWrongSignature);

        // Then
        assertThat(isValidSignature).isFalse();
    }

    @Test
    void should_catch_MalformedJwtException() {
        // Given
        String  tokenWithWrongFormat = "wrong_format_token";

        // When
        boolean isValidFormat = jwtUtils.validateJwtToken(tokenWithWrongFormat);

        // Then
        assertThat(isValidFormat).isFalse();
    }

    @Test
    void should_catch_ExpiredJwtException() {
        // Given
        String token = Jwts.builder()
                .setSubject("John@test.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // When
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void should_catch_UnsupportedJwtException() {
        // Given
        String tokenWithUnsupportedJwt = Jwts.builder()
                .setSubject("John@test.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .compact();

        // When
        boolean isValid = jwtUtils.validateJwtToken(tokenWithUnsupportedJwt);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void should_catch_IllegalArgumentException_with_empty_claims() {

        // When
        boolean isValid = jwtUtils.validateJwtToken("");

        // Then
        assertThat(isValid).isFalse();
    }


    private String generateJWTToken(UserDetails userDetailsImpl) {
        return Jwts.builder()
                .setSubject((userDetailsImpl.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

}