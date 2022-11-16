package com.asi2.msuser.model.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "id_cards_list")
    @ElementCollection
    private List<Long> idCardList;

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
