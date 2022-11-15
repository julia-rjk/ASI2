package com.asi2.msuser.service;

import model.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> findAll();

    UserDTO findById(Long id);

    UserDTO login(String login, String password);

    Boolean register(UserDTO userDto);

    Boolean delete(Long id);

    UserDTO update(Long id, UserDTO userDTO);
}
