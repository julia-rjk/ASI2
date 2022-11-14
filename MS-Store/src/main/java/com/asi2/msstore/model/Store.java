package com.asi2.msstore.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "store")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "id_card")
    private Long idCard;

    @Column(name = "id_user")
    private Long idUser;

    @Column(name = "store_action")
    private StoreAction storeAction;
}
