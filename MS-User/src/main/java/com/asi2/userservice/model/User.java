package com.asi2.userservice.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "login")
    private String login;

    @Column(name = "password")
    private String password;

    @Column(name = "account")
    private Float account;

    @Column(name = "lastName")
    private String lastName;

    @Column(name = "surName")
    private String surName;

    @Column(name = "email")
    private String email;
}
