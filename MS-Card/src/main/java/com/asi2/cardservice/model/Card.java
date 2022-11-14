package com.asi2.cardservice.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "card")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "id_card_basics")
    private Long idCardBasics;

    @Column(name = "id_user")
    private Long idUser;

    @Column(name = "energy")
    private Float energy;

    @Column(name = "hp")
    private Float hp;

    @Column(name = "defence")
    private Float defence;

    @Column(name = "attack")
    private Float attack;

    @Column(name = "price")
    private Float price;
}
