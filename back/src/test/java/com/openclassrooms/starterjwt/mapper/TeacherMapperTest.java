package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class TeacherMapperTest {

    private TeacherMapper entityMapper;

    private Teacher teacher;
    private TeacherDto teacherDto;

    @BeforeEach
    void setUp() {
        entityMapper = Mappers.getMapper(TeacherMapper.class);

        teacher = Teacher.builder()
                .id(1L)
                .firstName("Teacher")
                .lastName("Test")
                .build();

        teacherDto = new TeacherDto(1L, "Test", "Teacher", null, null);

    }

    @Test
    void should_map_TeacherDto_to_TeacherEntity() {
        Teacher teacherMapped = entityMapper.toEntity(teacherDto);
        assertThat(teacherMapped).isEqualTo(teacher);
    }

    @Test
    void should_map_TeacherEntity_to_TeacherDto() {
        TeacherDto teacherDtoMapped = entityMapper.toDto(teacher);
        assertThat(teacherDtoMapped).isEqualTo(teacherDto);
    }

    @Test
    void should_map_TeacherEntityList_to_TeacherDtoList() {
        Teacher teacher2 = Teacher.builder()
                .id(2L)
                .firstName("Teacher2")
                .lastName("Test2")
                .build();

        TeacherDto teacherDto2 = new TeacherDto(2L, "Test2", "Teacher2", null, null);

        assertThat(entityMapper.toDto(List.of(teacher, teacher2))).isEqualTo(List.of(teacherDto, teacherDto2));
    }

    @Test
    void should_map_TeacherDtoList_to_TeacherEntityList() {
        Teacher teacher2 = Teacher.builder()
                .id(2L)
                .firstName("Teacher2")
                .lastName("Test2")
                .build();

        TeacherDto teacherDto2 = new TeacherDto(2L, "Test2", "Teacher2", null, null);

        assertThat(entityMapper.toEntity(List.of(teacherDto, teacherDto2))).isEqualTo(List.of(teacher, teacher2));
    }

    @Test
    void should_map_TeacherDto_to_TeacherEntity_with_null() {
        Teacher teacherMapped = entityMapper.toEntity((TeacherDto) null);
        assertThat(teacherMapped).isNull();
    }

    @Test
    void should_map_TeacherEntity_to_TeacherDto_with_null() {
        TeacherDto teacherDtoMapped = entityMapper.toDto((Teacher) null);
        assertThat(teacherDtoMapped).isNull();
    }

    @Test
    void should_return_null_when_TeacherEntityList_is_null() {

        // When
        List<TeacherDto> teacherDtoMapped = entityMapper.toDto((List<Teacher>) null);

        // Then
        assertThat(teacherDtoMapped).isNull();
    }

    @Test
    void should_return_null_when_TeacherDtoList_is_null() {

        // When
        List<Teacher> teacherMapped = entityMapper.toEntity((List<TeacherDto>) null);

        // Then
        assertThat(teacherMapped).isNull();
    }

}