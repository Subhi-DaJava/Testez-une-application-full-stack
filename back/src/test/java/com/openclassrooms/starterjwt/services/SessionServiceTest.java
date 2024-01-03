package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {
    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private Teacher teacherA;
    private Teacher teacherB;
    private User userA;
    private User userB;
    private List<User> users;
    private Session sessionA;
    private Session sessionB;
    private List<Session> sessions;

    @BeforeEach
    void setUp() {
        teacherA = Teacher.builder()
                .id(1L)
                .lastName("Doe")
                .firstName("John")
                .build();
        teacherB = Teacher.builder()
                .id(2L)
                .lastName("Marie")
                .firstName("Anne")
                .build();

        userA = new User();
        userA.setId(1L);
        userA.setLastName("Gilbert");
        userA.setFirstName("Jaune");
        userA.setEmail("gilbert_jaune@test.com");
        userA.setAdmin(false);
        userA.setCreatedAt(LocalDateTime.now());
        userA.setUpdatedAt(LocalDateTime.now());

        userB = new User();
        userB.setId(2L);
        userB.setLastName("Dupont");
        userB.setFirstName("Jean");
        userB.setEmail("dupont_jean@test.com");
        userB.setAdmin(false);
        userB.setCreatedAt(LocalDateTime.now());
        userB.setUpdatedAt(LocalDateTime.now());

        users = List.of(userA);

        sessionA = Session.builder()
                .id(1L)
                .name("Yoga fundamentals 1")
                .description("Yoga is a group of physical, mental,and spiritual practices or disciplines which originated in ancient India.")
                .date(new Date())
                .teacher(teacherA)
                .users(users)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sessionB = Session.builder()
                .id(2L)
                .name("Yoga fundamentals 2")
                .description("Yoga is a group of physical, mental,and spiritual practices or disciplines which originated in ancient India.")
                .date(new Date())
                .teacher(teacherB)
                .users(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        sessions = List.of(sessionA, sessionB);
    }

    @Test
    void should_create_session() {
        // Given
        Session session = Session.builder()
                .id(1L)
                .name("Yoga fundamentals 1")
                .description("Yoga is a group of physical, mental,and spiritual practices or disciplines which originated in ancient India.")
                .date(new Date())
                .teacher(teacherA)
                .users(users)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(sessionRepository.save(sessionA)).thenReturn(session);

        // When
        Session actualSession = sessionService.create(sessionA);

        // Then
        assertThat(actualSession).isEqualTo(session);

    }

    @Test
    void should_not_create_session() {
        // Given
        Session session = new Session();

        doThrow(new RuntimeException("Invalid session!!")).when(sessionRepository).save(session);

        // Then
        assertThatThrownBy(() -> sessionService.create(session))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Invalid session!!");
    }

    @Test
    void should_delete_session_by_id() {
        // Given
        Long id = 2L;
        // When
        sessionService.delete(id);
        // Then
        verify(sessionRepository, times(1)).deleteById(id);

    }
    @Test
    void should_throw_error_when_delete_session_by_id() {
        // Given
        Long id = 2L;
        doThrow(new RuntimeException("Session not found")).when(sessionRepository).deleteById(id);
        // Then
        assertThatThrownBy(() -> sessionService.delete(id))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Session not found");
    }

    @Test
    void should_find_all_sessions() {

        // Given
        when(sessionRepository.findAll()).thenReturn(sessions);
        // When
        List<Session> actualSessions = sessionService.findAll();
        // Then
        assertThat(actualSessions).isEqualTo(sessions);
    }

    @Test
    void should_find_empty_list_of_sessions() {
        // Given
        when(sessionRepository.findAll()).thenReturn(List.of());
        // When
        List<Session> actualSessions = sessionService.findAll();
        // Then
        assertThat(actualSessions.size()).isEqualTo(0);
    }

    @Test
    void should_get_session_by_id() {
        // Given
        when(sessionRepository.findById(2L)).thenReturn(java.util.Optional.ofNullable(sessionB));
        // When
        Session actualSession = sessionService.getById(2L);
        // Then
        assertThat(actualSession).isEqualTo(sessionB);
    }
    @Test
    void should_not_get_session_by_id() {
        // When
        Session actualSession = sessionService.getById(2L);
        // Then
        assertThat(actualSession).isEqualTo(null);
    }

    @Test
    void should_update_session() {
        // Given
        Session updateSession = new Session();
        updateSession.setId(1L);
        updateSession.setName("Yoga fundamentals 1 updated");
        updateSession.setDescription("Yoga is a group of physical, mental,and spiritual practices or disciplines which originated in ancient India.");
        updateSession.setDate(new Date());
        updateSession.setTeacher(teacherB);
        updateSession.setUsers(users);
        updateSession.setCreatedAt(LocalDateTime.now());
        updateSession.setUpdatedAt(LocalDateTime.now());

        when(sessionRepository.save(any(Session.class))).thenReturn(updateSession);

        // When

        Session sessionUpdated = sessionService.update(1L, updateSession);

        // Then
        assertThat(sessionUpdated).isEqualTo(updateSession);
    }
    @Test
    void should_not_update_session() {
        // Given
        Session updateSession = new Session();

        doThrow(new RuntimeException("Session is not valid!!")).when(sessionRepository).save(updateSession);

        // Then
        assertThatThrownBy(() -> sessionService.update(1L, updateSession))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Session is not valid!!");
    }

    @Test
    void should_participate_in_session() {
        // Given
        when(sessionRepository.findById(2L)).thenReturn(Optional.ofNullable(sessionB));
        when(userRepository.findById(2L)).thenReturn(Optional.ofNullable(userB));

        // When
        sessionService.participate(2L, 2L);

        // Then
        verify(sessionRepository, times(1)).save(sessionB);

    }

    @Test
    void should_not_participate_in_session() {
        // Given
        when(sessionRepository.findById(1L)).thenReturn(Optional.ofNullable(sessionA));
        when(userRepository.findById(1L)).thenReturn(Optional.ofNullable(userA));

        // Then
        assertThatThrownBy(() -> sessionService.participate(1L, 1L))
                .isInstanceOf(BadRequestException.class);

    }

    @Test
    void should_not_participate_in_session_not_existing() {
        // Given
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.ofNullable(userA));

        // Then
        assertThatThrownBy(() -> sessionService.participate(anyLong(), 1L))
                .isInstanceOf(NotFoundException.class);

    }

    @Test
    void should_not_participate_in_session_user_not_existing() {
        // Given
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.ofNullable(sessionA));
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Then
        assertThatThrownBy(() -> sessionService.participate(1L, anyLong()))
                .isInstanceOf(NotFoundException.class);

    }

    @Test
    void should_noLongerParticipate_session() {
        // Given
        when(sessionRepository.findById(1L)).thenReturn(Optional.ofNullable(sessionA));

        // When
        sessionService.noLongerParticipate(1L, 1L);

        // Then
        verify(sessionRepository, times(1)).save(sessionA);
    }
    @Test
    void should_not_noLongerParticipate_session_not_existing() {
        // Given
       // when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        // Then
        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 1L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void should_not_noLongerParticipate_session_user_not_existing() {
        // Given
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.ofNullable(sessionB));

        // Then
        assertThatThrownBy(() -> sessionService.noLongerParticipate(2L, anyLong()))
                .isInstanceOf(BadRequestException.class);
    }
}