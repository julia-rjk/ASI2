package model.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String login;
    private String password;
    private Float account;
    private String lastName;
    private String surName;
    private String email;
}
