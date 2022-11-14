package com.asi2.userservice.controller;

import com.asi2.userservice.constant.Router;
import com.asi2.userservice.service.UserService;
import lombok.extern.slf4j.Slf4j;
import model.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(Router.URL_USERS)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public List<UserDTO> getAllUsers() {
        List<UserDTO> users = null;
        try {
            return userService.findAll();
        } catch (Exception e) {
            log.error("Error when retrieving all users : {}", e.getMessage());
            return null;
        }
    }

    @GetMapping(value = "/{id}")
    public UserDTO getUserByid(@PathVariable("id") Long id) {
        UserDTO userDto = null;
        try {
            return userService.findById(id);
        } catch (Exception e) {
            log.error("Error when retrieving user[{}]", e.getMessage());
            return null;
        }
    }

    @PutMapping(Router.REGISTER)
    public void register(@RequestBody @Validated UserDTO userDto) {
        try {
            userService.add(userDto);
        } catch (Exception e) {
            log.error("Error when registered the user : {}", e.getMessage());
        }
    }

    @PostMapping(Router.LOGIN)
    public UserDTO login(@RequestBody UserDTO userDTO) {
        try {
            return userService.login(userDTO.getLogin(), userDTO.getPassword());
        } catch (Exception e) {
            log.error("Error when login user : {}", e.getMessage());
            return null;
        }
    }
}
