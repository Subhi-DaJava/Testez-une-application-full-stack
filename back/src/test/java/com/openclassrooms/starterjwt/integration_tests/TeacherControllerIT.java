package com.openclassrooms.starterjwt.integration_tests;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TeacherControllerIT {

    @Autowired
    private MockMvc mockMvc;

    private static final String BASE_URL = "/api/teacher";

    @Autowired
    private JwtUtils jwtUtils;

    private String jwtToken;

    @BeforeEach
    public void setUpEach() {
        UserDetails userDetails = UserDetailsImpl.builder()
                .username("yoga@studio.com").build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        jwtToken = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    void should_Return_200_When_Teacher_Find_By_Id_Is_Successful_With_Valid_JWT() throws Exception {
        mockMvc.perform(get(BASE_URL + "/1")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.lastName").exists())
                .andExpect(jsonPath("$.firstName").exists())
                .andExpect(jsonPath("$.createdAt").isEmpty())
                .andExpect(jsonPath("$.updatedAt").isEmpty());

    }

    @WithMockUser
    @Test
    void should_Return_200_When_Teacher_Find_By_Id_Is_Successful_With_Mock_User() throws Exception {
        mockMvc.perform(get(BASE_URL + "/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.lastName").exists())
                .andExpect(jsonPath("$.lastName").value("THIERCELIN"))
                .andExpect(jsonPath("$.firstName").exists())
                .andExpect(jsonPath("$.createdAt").isEmpty())
                .andExpect(jsonPath("$.updatedAt").isEmpty());
    }

    @Test
    void should_Return_404_When_Teacher_Find_By_Id_Is_Unsuccessful() throws Exception {
        mockMvc.perform(get(BASE_URL + "/999")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_Return_401_When_Teacher_Find_By_Id_Is_Unsuccessful_With_Not_Authenticated() throws Exception {
        mockMvc.perform(get(BASE_URL + "/1"))
                .andExpect(status().isUnauthorized());
    }


    @Test
    void should_Return_200_When_Teacher_Find_All_Is_Successful() throws Exception {
        mockMvc.perform(get(BASE_URL)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].lastName").exists())
                .andExpect(jsonPath("$[0].firstName").exists())
                .andExpect(jsonPath("$[0].createdAt").isEmpty())
                .andExpect(jsonPath("$[0].updatedAt").isEmpty())
                .andExpect(jsonPath("$[1].id").exists())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void should_Return_401_When_Teacher_Find_All_Is_Unsuccessful() throws Exception {
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isUnauthorized());
    }
}
