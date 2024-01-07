package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

    @Mock
    private SessionMapper sessionMapper;
    @Mock
    private SessionService sessionService;

    @InjectMocks
    private SessionController sessionController;

    private Session session;
    private Teacher teacher;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFirstName("Emily");
        user.setLastName("Smith");
        user.setEmail("emily@test.com");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        teacher = Teacher.builder()
                .id(1L)
                .firstName("Aline")
                .lastName("Bouchard")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        session = Session.builder()
                .id(1L)
                .name("Exercice 1")
                .description("Yoga for beginners")
                .date(new Date())
                .teacher(teacher)
                .users(List.of())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }


    @Test
    void should_find_session_By_sessionId() {
        // Given
        SessionDto sessionDto = new SessionDto(
                1L,
                "Exercice 1",
                new Date(),
                1L,
                "Yoga for beginners",
                new ArrayList<>(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // When
        ResponseEntity<?> response = sessionController.findById("1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(sessionDto);
    }

    @Test
    void should_not_find_session_By_sessionId_session_not_existing() {
        // Given
        // when(sessionService.getById(1L)).thenReturn(null);

        // When
        ResponseEntity<?> response = sessionController.findById("1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(404);
        verify(sessionService, times(1)).getById(1L);
    }

    @Test
    void should_not_find_by_sessionId_sessionId_NAN() {
        // When
        ResponseEntity<?> response = sessionController.findById("abc");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verify(sessionService, times(0)).getById(1L);
    }

    @Test
    void should_find_all_sessions() {
        // Given
        SessionDto sessionDto = new SessionDto(
                1L,
                "Exercice 1",
                new Date(),
                1L,
                "Yoga for beginners",
                List.of(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(sessionService.findAll()).thenReturn(List.of(session));
        when(sessionMapper.toDto(List.of(session))).thenReturn(List.of(sessionDto));

        // When
        ResponseEntity<?> response = sessionController.findAll();

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(List.of(sessionDto));
    }

    @Test
    void should_find_all_sessions_return_empty_list() {
        // Given
        when(sessionService.findAll()).thenReturn(List.of());
        when(sessionMapper.toDto(List.of())).thenReturn(List.of());

        // When
        ResponseEntity<?> response = sessionController.findAll();

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(List.of());
    }

    @Test
    void should_create_a_new_session() {
        // Given
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Exercice 1");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("Yoga for beginners");
        sessionDto.setUsers(new ArrayList<>());
        sessionDto.setCreatedAt(LocalDateTime.now());
        sessionDto.setUpdatedAt(LocalDateTime.now());

        Session sessionMapped = new Session();
        sessionMapped.setName("Exercice 1");
        sessionMapped.setDate(new Date());
        sessionMapped.setTeacher(teacher);
        sessionMapped.setDescription("Yoga for beginners");
        sessionMapped.setUsers(new ArrayList<>());
        sessionMapped.setCreatedAt(LocalDateTime.now());
        sessionMapped.setUpdatedAt(LocalDateTime.now());

        when(sessionMapper.toEntity(sessionDto)).thenReturn(sessionMapped);
        when(sessionService.create(sessionMapped)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // When
        ResponseEntity<?> response = sessionController.create(sessionDto);

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(sessionDto);
    }

    @Test
    void should_update_session_existing() {

        // Given
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Exercice 1 updated");
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("Yoga for beginners updated");
        sessionDto.setUsers(new ArrayList<>());


        Session sessionMapped = new Session();
        sessionMapped.setId(1L);
        sessionMapped.setName("Exercice 1 updated");
        sessionMapped.setTeacher(teacher);
        sessionMapped.setDescription("Yoga for beginners updated");
        sessionMapped.setUsers(new ArrayList<>());

        Session updatedSession = new Session();
        updatedSession.setId(1L);
        updatedSession.setName("Exercice 1 updated");
        updatedSession.setTeacher(teacher);
        updatedSession.setDescription("Yoga for beginners updated");
        updatedSession.setUsers(new ArrayList<>());

        when(sessionMapper.toEntity(sessionDto)).thenReturn(sessionMapped);
        when(sessionService.update(1L, sessionMapped)).thenReturn(updatedSession);
        when(sessionMapper.toDto(updatedSession)).thenReturn(sessionDto);

        // When
        ResponseEntity<?> response = sessionController.update("1", sessionDto);

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(sessionDto);
    }

    @Test
    void should_not_update_session_with_sessionId_NAN() {
        // Given
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);

        // When
        ResponseEntity<?> response = sessionController.update("abc", sessionDto);

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verify(sessionService, times(0)).update(1L, session);
    }

    @Test
    void should_delete_session_existing() {
        // Given
        when(sessionService.getById(1L)).thenReturn(session);

        // When
        ResponseEntity<?> response = sessionController.delete("1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(sessionService, times(1)).delete(1L);
    }

    @Test
    void should_not_delete_session_with_sessionId_NAN() {
        // When
        ResponseEntity<?> response = sessionController.delete("abc");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verify(sessionService, times(0)).delete(1L);
    }

    @Test
    void should_not_delete_session_not_existing() {
        // Given
        // when(sessionService.getById(1L)).thenReturn(null);

        // When
        ResponseEntity<?> response = sessionController.delete("1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(404);
        verify(sessionService, times(0)).delete(1L);
    }

    @Test
    void should_user_participate_in_session() {
        // Given
        doNothing().when(sessionService).participate(1L, 1L);

        // When
        ResponseEntity<?> response = sessionController.participate("1", "1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(sessionService, times(1)).participate(1L, 1L);

    }
    
    @Test
    void should_not_participate_in_session_with_sessionId_NAN() {
        // When
        ResponseEntity<?> response = sessionController.participate("abc", "1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verify(sessionService, times(0)).participate(1L, 1L);
    }

    @Test
    void should_noLongerParticipate_in_session() {
        // Given
        Session sessionB = new Session();
        sessionB.setId(2L);
        sessionB.setName("Exercice 2B");
        sessionB.setDate(new Date());
        sessionB.setTeacher(teacher);
        sessionB.setDescription("Yoga for beginners BIS");
        sessionB.setUsers(List.of(user));
        sessionB.setCreatedAt(LocalDateTime.now());
        sessionB.setUpdatedAt(LocalDateTime.now());

        doNothing().when(sessionService).noLongerParticipate(2L, 1L);

        // When
        ResponseEntity<?> response = sessionController.noLongerParticipate("2", "1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        verify(sessionService, times(1)).noLongerParticipate(2L, 1L);
    }

    @Test
    void should_not_noLongerParticipate_in_session_with_sessionId_NAN() {
        // When
        ResponseEntity<?> response = sessionController.noLongerParticipate("abc", "1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verify(sessionService, times(0)).noLongerParticipate(2L, 1L);
    }
}