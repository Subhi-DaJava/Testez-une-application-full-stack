package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class UserMapperTest {

    private UserMapper entityMapper;

    private User user;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        entityMapper = Mappers.getMapper(UserMapper.class);
        user = User.builder()
                .id(1L)
                .email("user@test.com")
                .password("password")
                .admin(false)
                .firstName("User")
                .lastName("Test")
                .createdAt(LocalDateTime.of(2024, 1, 1, 0, 0, 0))
                .updatedAt(LocalDateTime.of(2024, 1, 1, 0, 0, 0))
                .build();
        userDto = new UserDto(1L, "user@test.com",
                "Test", "User",
                false, "password",
                LocalDateTime.of(2024, 1, 1, 0, 0, 0),
                LocalDateTime.of(2024, 1, 1, 0, 0, 0));
    }
    @Test
    void should_map_UserDto_to_UserEntity() {
        User userMapped = entityMapper.toEntity(userDto);
        assertThat(userMapped).isEqualTo(user);

    }

    @Test
    void should_map_UserEntity_to_UserDto() {
        UserDto userDtoMapped = entityMapper.toDto(user);
        assertThat(userDtoMapped).isEqualTo(userDto);
    }

    @Test
    void should_map_UserEntityList_to_UserDtoList() {
        List<User> users = List.of(user);
        List<UserDto> userDTOs = List.of(userDto);
        List<UserDto> userDTOsMapped = entityMapper.toDto(users);

        assertThat(userDTOsMapped).isEqualTo(userDTOs);
    }

    @Test
    void should_map_UserDtoList_to_UserEntityList() {
        List<User> users = List.of(user);
        List<UserDto> userDTOs = List.of(userDto);
        List<User> usersMapped = entityMapper.toEntity(userDTOs);

        assertThat(usersMapped).isEqualTo(users);
    }

    @Test
    void should_map_UserDto_to_UserEntity_with_null() {
        User userMapped = entityMapper.toEntity((UserDto) null);
        assertThat(userMapped).isNull();
    }

    @Test
    void should_map_UserEntity_to_UserDto_with_null() {
        UserDto userDtoMapped = entityMapper.toDto((User) null);
        assertThat(userDtoMapped).isNull();
    }

    @Test
    void should_return_null_when_UserEntityList_is_null() {
        List<UserDto> userDTOsMapped = entityMapper.toDto((List<User>) null);
        assertThat(userDTOsMapped).isNull();
    }

    @Test
    void should_return_null_when_UserDtoList_is_null() {
        List<User> usersMapped = entityMapper.toEntity((List<UserDto>) null);
        assertThat(usersMapped).isNull();
    }

}