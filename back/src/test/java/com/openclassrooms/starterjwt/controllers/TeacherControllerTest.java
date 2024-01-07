package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherControllerTest {

    @Mock
    private TeacherMapper teacherMapper;

    @Mock
    private TeacherService teacherService;

    @InjectMocks
    private TeacherController teacherController;

    private Teacher teacherA;
    private Teacher teacherB;
    private List<Teacher> teachers;

    @BeforeEach
    void setUp() {
        teacherA = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        teacherB = Teacher.builder()
                .id(2L)
                .firstName("Jane")
                .lastName("Harper")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        teachers = List.of(teacherA, teacherB);
    }

    @Test
    void should_find_teacher_by_teacherId() {
        // Given
        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setFirstName("John");
        teacherDto.setLastName("Doe");
        teacherDto.setCreatedAt(LocalDateTime.now());
        teacherDto.setUpdatedAt(LocalDateTime.now());

        when(teacherService.findById(1L)).thenReturn(teacherA);
        when(teacherMapper.toDto(teacherA)).thenReturn(teacherDto);

        // When
        ResponseEntity<?> response = teacherController.findById("1");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(teacherDto);

    }

    @Test
    void should_not_find_teacher_by_teacherId_teacher_not_existing() {
        // Given
       // when(teacherService.findById(1L)).thenReturn(null);

        // When
        ResponseEntity<?> response = teacherController.findById("2");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(404);
        verify(teacherService, times(1)).findById(2L);
    }

    @Test
    void should_not_find_teacher_by_teacherId_is_NAN() {
        // When
        ResponseEntity<?> response = teacherController.findById("a");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        verify(teacherService, never()).findById(anyLong());
    }

    @Test
    void should_find_all_teachers() {
        // Given
        TeacherDto teacherDtoA = new TeacherDto();
        teacherDtoA.setId(1L);
        teacherDtoA.setFirstName("John");
        teacherDtoA.setLastName("Doe");
        teacherDtoA.setCreatedAt(LocalDateTime.now());
        teacherDtoA.setUpdatedAt(LocalDateTime.now());

        TeacherDto teacherDtoB = new TeacherDto();
        teacherDtoB.setId(2L);
        teacherDtoB.setFirstName("Jane");
        teacherDtoB.setLastName("Harper");
        teacherDtoB.setCreatedAt(LocalDateTime.now());
        teacherDtoB.setUpdatedAt(LocalDateTime.now());

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(List.of(teacherDtoA, teacherDtoB));

        // When
        ResponseEntity<?> response = teacherController.findAll();

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isEqualTo(List.of(teacherDtoA, teacherDtoB));
    }
}