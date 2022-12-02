package com.asi2.mschathistory.model.entity;

import lombok.Data;

import java.sql.Date;

import javax.persistence.*;

@Data
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "userId")
    private Integer userId;
  
    @Column(name = "room")
    private String room;

    @Column(name = "message")
    private String message;

    @Column(name = "date")
    private Date date;

    public boolean isPresent() {
        return false;
    }
}
