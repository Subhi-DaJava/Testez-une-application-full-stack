package com.openclassrooms.starterjwt.integration_tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils;

    private String adminJwtToken;
    private String userJwtToken;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String BASE_URL = "/api/session";

    @BeforeEach
    public void setUpEach() {
        UserDetails adminUserDetails = UserDetailsImpl.builder()
                .username("yoga@studio.com").build();
        Authentication adminAuthentication = new UsernamePasswordAuthenticationToken(
                adminUserDetails, "Password", adminUserDetails.getAuthorities());

        adminJwtToken = jwtUtils.generateJwtToken(adminAuthentication);

        UserDetails userUserDetails = UserDetailsImpl.builder()
                .username("subhi@test.com").build();

        Authentication userAuthentication = new UsernamePasswordAuthenticationToken(
                userUserDetails, "Password", userUserDetails.getAuthorities());

        userJwtToken = jwtUtils.generateJwtToken(userAuthentication);

    }

    @Test
    void should_Return_200_When_Session_Find_By_Id_Is_Successful() throws Exception {

        mockMvc.perform(get(BASE_URL + "/1")
                        .header("Authorization", "Bearer " + adminJwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.description").exists())
                .andExpect(jsonPath("$.date").exists())
                .andExpect(jsonPath("$.users").exists())
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.updatedAt").exists());
    }

    @Test
    void should_Return_200_When_Session_Find_By_Id_Is_Successful_With_User_JWT() throws Exception {

        mockMvc.perform(get(BASE_URL + "/2")
                        .header("Authorization", "Bearer " + userJwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.description").exists())
                .andExpect(jsonPath("$.date").exists())
                .andExpect(jsonPath("$.users").exists())
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.updatedAt").exists());
    }

    @WithMockUser
    @Test
    void should_Return_200_When_Session_Find_By_Id_Is_Successful_With_User_JWT_With_MockUser() throws Exception {

        mockMvc.perform(get(BASE_URL + "/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.description").exists())
                .andExpect(jsonPath("$.date").exists())
                .andExpect(jsonPath("$.users").exists())
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.updatedAt").exists());
    }

    @Test
    void should_Return_404_When_Session_Find_By_Id_Is_Unsuccessful() throws Exception {

        mockMvc.perform(get(BASE_URL + "/999")
                        .header("Authorization", "Bearer " + adminJwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_Throw_NumberFormatException_When_Session_Find_By_Id_Is_Unsuccessful() throws Exception {

        mockMvc.perform(get(BASE_URL + "/abc")
                        .header("Authorization", "Bearer " + adminJwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_Return_Session_List_When_Session_Find_All_Is_Successful() throws Exception {

        mockMvc.perform(get(BASE_URL)
                        .header("Authorization", "Bearer " + userJwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].name").exists())
                .andExpect(jsonPath("$[0].description").exists())
                .andExpect(jsonPath("$[0].date").exists())
                .andExpect(jsonPath("$[0].users").exists())
                .andExpect(jsonPath("$[0].createdAt").exists())
                .andExpect(jsonPath("$[0].updatedAt").exists())
                .andExpect(jsonPath("$[1].id").exists())
                .andExpect(jsonPath("$[1].name").exists())
                .andExpect(jsonPath("$[1].description").exists())
                .andExpect(jsonPath("$[1].date").exists())
                .andExpect(jsonPath("$[1].users").exists())
                .andExpect(jsonPath("$[1].createdAt").exists())
                .andExpect(jsonPath("$[1].updatedAt").exists())
             //   .andExpect(jsonPath("$.size()").value(3))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void should_Return_401_When_Session_Find_All_Is_Unsuccessful() throws Exception {

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Return_200_When_Session_Create_Is_Successful() throws Exception {

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("test");
        sessionDto.setDescription("test");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);


        mockMvc.perform(post(BASE_URL)
                        .header("Authorization", "Bearer " + adminJwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
            //    .andExpect(jsonPath("$.id").value(4))
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.description").exists());
    }

    @Test
    void should_Return_401_When_Session_Create_Is_Unsuccessful() throws Exception {

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("test");
        sessionDto.setDescription("test");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Return_200_When_Session_Update_Is_Successful() throws Exception {

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("test _ updated");
        sessionDto.setDescription("test _ updated");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(2L);

        mockMvc.perform(put(BASE_URL + "/4")
                        .header("Authorization", "Bearer " + adminJwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.id").value(4))
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.name").value("test _ updated"))
                .andExpect(jsonPath("$.description").exists());
    }

    @Test
    void should_Return_401_When_Session_Update_Is_Unsuccessful() throws Exception {

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("test _ updated");
        sessionDto.setDescription("test _ updated");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(2L);

        mockMvc.perform(put(BASE_URL + "/4")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Throw_NumberFormat_Exception_When_Session_Update_Is_Unsuccessful() throws Exception {

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("test _ updated");
        sessionDto.setDescription("test _ updated");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(2L);

        mockMvc.perform(put(BASE_URL + "/abc")
                        .header("Authorization", "Bearer " + adminJwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isBadRequest());
    }


    @Test
    void should_Return_200_When_Session_Delete_Is_Successful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/3")
                        .header("Authorization", "Bearer " + adminJwtToken))
                .andExpect(status().isOk());
    }

    @Test
    void should_Return_401_When_Session_Delete_Is_Unsuccessful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/3"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Return_404_When_Session_Delete_Is_Unsuccessful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/999")
                        .header("Authorization", "Bearer " + adminJwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_Throw_NumberFormat_Exception_When_Session_Delete_Is_Unsuccessful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/abc")
                        .header("Authorization", "Bearer " + adminJwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_Return_200_When_User_Participate_Is_Successful() throws Exception {

        mockMvc.perform(post(BASE_URL + "/1/participate/2")
                        .header("Authorization", "Bearer " + userJwtToken))
                .andExpect(status().isOk());
    }

    @Test
    void should_Return_401_When_User_Participate_Is_Unsuccessful() throws Exception {

        mockMvc.perform(post(BASE_URL + "/1/participate/2"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Throw_NumberFormat_Exception_When_User_Participate_Is_Unsuccessful() throws Exception {

        mockMvc.perform(post(BASE_URL + "/abc/participate/2")
                        .header("Authorization", "Bearer " + userJwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void should_Return_200_When_User_No_Longer_Participate_Is_Successful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/2/participate/2")
                        .header("Authorization", "Bearer " + userJwtToken))
                .andExpect(status().isOk());
    }

    @Test
    void should_Return_401_When_User_No_Longer_Participate_Is_Unsuccessful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/2/participate/2"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_Throw_NumberFormat_Exception_When_User_No_Longer_Participate_Is_Unsuccessful() throws Exception {

        mockMvc.perform(delete(BASE_URL + "/abc/participate/2")
                        .header("Authorization", "Bearer " + userJwtToken))
                .andExpect(status().isBadRequest());
    }

}
