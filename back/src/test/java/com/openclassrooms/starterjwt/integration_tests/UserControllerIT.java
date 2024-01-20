package com.openclassrooms.starterjwt.integration_tests;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils;

    private String jwtToken;

    private Authentication authentication;

    private static final String BASE_URL = "/api/user";

    @BeforeEach
    public void setUpEach() {
        UserDetails userDetails = UserDetailsImpl.builder()
                .username("subhi@test.com").build();
        authentication = new UsernamePasswordAuthenticationToken(userDetails, "Password", userDetails.getAuthorities());

        jwtToken = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void should_Return_200_When_User_Find_By_Id_Is_Successful_JWT() throws Exception {
        UserDetails userDetails = UserDetailsImpl.builder()
                .username("yoga@studio.com").build();
        authentication = new UsernamePasswordAuthenticationToken(userDetails, "Password", userDetails.getAuthorities());
        jwtToken = jwtUtils.generateJwtToken(authentication);

        mockMvc.perform(get(BASE_URL + "/1")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.lastName").exists())
                .andExpect(jsonPath("$.firstName").exists())
                .andExpect(jsonPath("$.email").exists())
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.admin").exists())
                .andExpect(jsonPath("$.admin").value(true));

    }

    @Test
    void should_Return_401_When_User_Find_By_Id_Is_Unsuccessful_With_Fake_JWT() throws Exception {

        mockMvc.perform(get(BASE_URL + "/2")
                        .header("Authorization", "Bearer " + "FakeToken"))
                .andExpect(status().isUnauthorized());

    }

    @WithMockUser
    @Test
    void should_Return_200_When_User_Find_By_Id_Is_Successful() throws Exception {

        mockMvc.perform(get(BASE_URL + "/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.lastName").exists())
                .andExpect(jsonPath("$.firstName").exists())
                .andExpect(jsonPath("$.email").exists())
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.admin").exists())
                .andExpect(jsonPath("$.admin").value(false));
    }

    @WithMockUser
    @Test
    void should_Return_404_When_User_Find_By_Id_Is_Unsuccessful() throws Exception {

        mockMvc.perform(get(BASE_URL + "/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_Return_401_When_User_Find_By_Id_Is_Unsuccessful() throws Exception {

        mockMvc.perform(get(BASE_URL + "/2"))
                .andExpect(status().isUnauthorized());
    }


    @Test
    void should_Return_200_When_User_Delete_By_Id_Is_Successful() throws Exception {
        UserDetails userDetails = UserDetailsImpl.builder()
                .username("test_delete@test.com").build();
        authentication = new UsernamePasswordAuthenticationToken(userDetails, "Password", userDetails.getAuthorities());

        jwtToken = jwtUtils.generateJwtToken(authentication);
        mockMvc.perform(delete(BASE_URL + "/4")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());

    }

    @Test
    void should_Return_401_When_User_Delete_By_Id_Is_Unsuccessful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/2"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Return_404_When_User_Delete_By_Id_Is_Unsuccessful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/999")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_Throw_NumberFormatException_When_User_Delete_By_Id_Is_Unsuccessful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/wrongId")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }

}
