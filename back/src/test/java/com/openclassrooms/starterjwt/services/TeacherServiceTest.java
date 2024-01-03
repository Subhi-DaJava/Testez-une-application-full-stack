package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {
    @InjectMocks
    private TeacherService teacherService;
    @Mock
    private TeacherRepository teacherRepository;

    private Teacher teacher;
    private List<Teacher> teachers;

    @BeforeEach
    void setUp() {
        teacher = Teacher.builder()
                .id(1L)
                .lastName("Doe")
                .firstName("John")
                .createdAt(LocalDateTime.of(2021, 1, 1, 0, 0))
                .updatedAt(LocalDateTime.of(2021, 1, 1, 0, 0))
                .build();
        teachers = List.of(teacher);
    }
    @Test
    void should_find_all_teachers() {
        // Given
        when(teacherRepository.findAll()).thenReturn(teachers);
        // When
        List<Teacher> actualTeachers = teacherService.findAll();
        // Then
        assertThat(actualTeachers).isEqualTo(teachers);
    }

    @Test
    void should_find_empty_list_of_teachers() {
        // Given
        when(teacherRepository.findAll()).thenReturn(List.of());
        // When
        List<Teacher> actualTeachers = teacherService.findAll();
        // Then
        assertThat(actualTeachers.size()).isEqualTo(0);
    }


    @Test
    void should_find_teacher_by_id() {
        // Given
        when(teacherRepository.findById(1L)).thenReturn(java.util.Optional.ofNullable(teacher));
        // When
        Teacher actualTeacher = teacherService.findById(1L);
        // Then
        assertThat(actualTeacher).isEqualTo(teacher);
    }

    @Test
    void should_not_find_teacher_by_id() {
        // Given
        /*
        Since we rarely handle null values when dealing with Optional,
        Mockito now returns an empty Optional by default. That is the exact same value as the return of a call to Optional.empty().
         */
       // when(teacherRepository.findById(1L)).thenReturn(java.util.Optional.empty());
        // When
        Teacher actualTeacher = teacherService.findById(1L);
        // Then
        assertThat(actualTeacher).isNull();
    }
}