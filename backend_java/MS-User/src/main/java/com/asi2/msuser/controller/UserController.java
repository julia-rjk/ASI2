package com.asi2.msuser.controller;

import com.asi2.msuser.constant.Router;
import com.asi2.msuser.service.user.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionBasic;
import model.dto.UserDTO;
import model.message.CustomMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import service.SenderService;

import java.util.Date;
import java.util.List;
import java.util.Random;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping(Router.URL_USERS)
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SenderService<UserDTO, ActionBasic> senderService;

    @ApiOperation(value = "", nickname = "getAllUsers")
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

    @ApiOperation(value = "", nickname = "getUserByid")
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

    @PutMapping("/{id}")
    public UserDTO updateUserAsync(@RequestBody UserDTO userDTO) {
        try {
            senderService.sendMessage(new CustomMessage<>(
                    new Random().nextLong(),
                    ActionBasic.UPDATE,
                    ServletUriComponentsBuilder.fromCurrentContextPath().toUriString(),
                    String.valueOf(new Date()),
                    userDTO
            ));

        } catch (Exception e) {
            log.error("Error when creating the message for the queue : {}", e.getMessage());
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public Boolean deleteUser(@PathVariable Long id) {
        try {
            return userService.delete(id);
        } catch (Exception e) {
            log.error("An error occurred when deleting the user : {}", e.getMessage());
            return Boolean.FALSE;
        }
    }

    @ApiOperation(value = "", nickname = "register")
    @PostMapping(Router.REGISTER)
    public UserDTO registerAsync(@RequestBody @Validated UserDTO userDto) {
        try {
            senderService.sendMessage(new CustomMessage<>(
                    new Random().nextLong(),
                    ActionBasic.ADD,
                    ServletUriComponentsBuilder.fromCurrentContextPath().toUriString(),
                    String.valueOf(new Date()),
                    userDto
            ));

        } catch (Exception e) {
            log.error("Error when creating the message for the queue : {}", e.getMessage());
        }

        return null;
    }

    @ApiOperation(value = "", nickname = "login")
    @PutMapping(Router.LOGIN)
    public UserDTO login(@RequestBody UserDTO userDTO) {
        try {
            return userService.login(userDTO.getLogin(), userDTO.getPassword());
        } catch (Exception e) {
            log.error("Error when login user : {}", e.getMessage());
            return null;
        }
    }
}
