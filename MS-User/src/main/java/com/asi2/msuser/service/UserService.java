package com.asi2.msuser.service;

import model.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> findAll();

    UserDTO findById(Long id);

    UserDTO login(String login, String password);

    Boolean register(UserDTO userDto);

    void delete(UserDTO userDto);

    void update(UserDTO userDto);
}
