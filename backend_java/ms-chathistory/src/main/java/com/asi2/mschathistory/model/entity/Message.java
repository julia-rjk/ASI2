package com.asi2.mschathistory.model.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "users")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "userId")
    private Integer userId;
  
    @Column(name = "room")
    private String room;

    @Column(name = "text")
    private String text;

    @Column(name = "timestamp")
    private String timestamp;

    public boolean isPresent() {
        return false;
    }
}
