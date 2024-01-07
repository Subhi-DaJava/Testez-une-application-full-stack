package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


class SessionMapperTest {
    private final SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

    private Session session;
    private SessionDto sessionDto;
    private Teacher teacher;
    private User user;

    @BeforeEach
    void setUp() {
        teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Teacher");
        teacher.setLastName("Test");
        teacher.setCreatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));
        teacher.setUpdatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));

        user = new User();
        user.setId(1L);
        user.setPassword("password");
        user.setFirstName("User");
        user.setLastName("Test");
        user.setEmail("user@test.com");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));
        user.setUpdatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));

        session = Session.builder()
                .id(1L)
                .name("Yoga session 1")
                .description("description")
                .teacher(teacher)
                .users(List.of(user))
                .date(new Date())
                .createdAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0))
                .updatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0))
                .build();

        sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Yoga session 1");
        sessionDto.setDescription("description");
        sessionDto.setDate(new Date());
        sessionDto.setCreatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));
        sessionDto.setUpdatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));
    }
    @Test
    void should_map_SessionDto_to_SessionEntity() {

        // When
        Session sessionMapped = sessionMapper.toEntity(sessionDto);

        // Then
        assertThat(sessionMapped).isNotNull();
        assertThat(sessionMapped.getId()).isEqualTo(sessionDto.getId());
        assertThat(sessionMapped.getName()).isEqualTo(sessionDto.getName());
        assertThat(sessionMapped.getDescription()).isEqualTo(sessionDto.getDescription());
    }

    @Test
    void should_map_SessionEntity_to_SessionDto() {
        // Given
        SessionDto sessionDtoBeMapped = new SessionDto();
        sessionDtoBeMapped.setId(1L);
        sessionDtoBeMapped.setName("Yoga session 1");
        sessionDtoBeMapped.setDescription("description");
        sessionDtoBeMapped.setTeacher_id(1L);
        sessionDtoBeMapped.setUsers(List.of(1L));
        sessionDtoBeMapped.setDate(new Date());
        sessionDtoBeMapped.setCreatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));
        sessionDtoBeMapped.setUpdatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));

        // When
        SessionDto sessionDtoMapped = sessionMapper.toDto(session);

        // Then
        assertThat(sessionDtoMapped.getName()).isEqualTo(sessionDtoBeMapped.getName());
        assertThat(sessionDtoMapped.getDescription()).isEqualTo(sessionDtoBeMapped.getDescription());
        assertThat(sessionDtoMapped.getTeacher_id()).isEqualTo(sessionDtoBeMapped.getTeacher_id());
    }

    @Test
    void should_map_SessionDtoList_to_SessionEntityList() {
        // Given
        SessionDto sessionDto2 = new SessionDto();
        sessionDto2.setId(2L);
        sessionDto2.setName("Yoga session 2");
        sessionDto2.setDescription("description");
        sessionDto2.setDate(new Date());
        sessionDto2.setCreatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));
        sessionDto2.setUpdatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0));

        // When
        List<Session> sessionMapped = sessionMapper.toEntity(List.of(sessionDto, sessionDto2));

        // Then
        assertThat(sessionMapped).isNotNull();
        assertThat(sessionMapped.size()).isEqualTo(2);
        assertThat(sessionMapped.get(0).getId()).isEqualTo(sessionDto.getId());
        assertThat(sessionMapped.get(1).getId()).isEqualTo(sessionDto2.getId());
    }

    @Test
    void should_map_SessionEntityList_to_SessionDtoList() {
        // Given
        Session session2 = Session.builder()
                .id(2L)
                .name("Yoga session 2")
                .description("description")
                .teacher(teacher)
                .users(List.of(user))
                .date(new Date())
                .createdAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0))
                .updatedAt(LocalDateTime.of(2024, 1, 5, 23, 57, 0))
                .build();

        // When
        List<SessionDto> sessionDtoMapped = sessionMapper.toDto(List.of(session, session2));

        // Then
        assertThat(sessionDtoMapped).isNotNull();
        assertThat(sessionDtoMapped.size()).isEqualTo(2);
        assertThat(sessionDtoMapped.get(0).getId()).isEqualTo(session.getId());
        assertThat(sessionDtoMapped.get(1).getId()).isEqualTo(session2.getId());
        assertThat(sessionDtoMapped.get(0).getName()).isEqualTo(session.getName());
    }

    @Test
    void should_map_null_SessionEntity_to_SessionDto_return_null() {

        // When
        SessionDto sessionDtoMapped = sessionMapper.toDto((Session) null);

        // Then
        assertThat(sessionDtoMapped).isNull();

    }

    @Test
    void should_map_null_SessionDto_to_SessionEntity_return_null() {

        // When
        Session sessionMapped = sessionMapper.toEntity((SessionDto) null);

        // Then
        assertThat(sessionMapped).isNull();

    }

    @Test
    void should_map_SessionEntity_with_null_values_to_SessionDto_return_null() {
        // Given
        session.setTeacher(null);

        // When
        SessionDto sessionDtoMapped = sessionMapper.toDto(session);

        // Then
        assertThat(sessionDtoMapped).isNotNull();
        assertThat(sessionDtoMapped.getTeacher_id()).isNull();
        assertThat(sessionDtoMapped.getUsers().size()).isEqualTo(1);
    }

    @Test
    void should_return_null_when_SessionEntityList_is_null() {

        // When
        List<SessionDto> sessionDtoMapped = sessionMapper.toDto((List<Session>) null);

        // Then
        assertThat(sessionDtoMapped).isNull();
    }

    @Test
    void should_return_null_when_SessionDtoList_is_null() {

        // When
        List<Session> sessionMapped = sessionMapper.toEntity((List<SessionDto>) null);

        // Then
        assertThat(sessionMapped).isNull();
    }

    @Test
    void should_return_null_when_Session_teacher_is_null() {
        // Given
        sessionDto.setTeacher_id(null);

        // When
        Session sessionMapped = sessionMapper.toEntity(sessionDto);

        // Then
        assertThat(sessionMapped).isNotNull();
        assertThat(sessionMapped.getTeacher()).isNull();
    }

    @Test
    void should_return_null_when_Session_teacher_id_is_null() {
        // Given
        teacher.setId(null);

        // When
        SessionDto sessionDtoMapped = sessionMapper.toDto(session);

        // Then
        assertThat(sessionDtoMapped).isNotNull();
        assertThat(sessionDtoMapped.getTeacher_id()).isNull();
    }

    @Test
    void should_return_null_when_Session_users_is_null() {
        // Given
        sessionDto.setUsers(null);

        // When
        Session sessionMapped = sessionMapper.toEntity(sessionDto);

        // Then
        assertThat(sessionMapped).isNotNull();
        assertThat(sessionMapped.getUsers()).isEqualTo(List.of());
    }

}
