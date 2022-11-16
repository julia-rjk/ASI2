package com.asi2.msuser.service.user;

import model.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> findAll();

    UserDTO findById(Long id);

    UserDTO login(String login, String password);

    Boolean register(UserDTO userDto, String callback);

    UserDTO update(UserDTO userDTO);

    Boolean delete(Long id);
}
