package com.asi2.mscardBasic.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "card_basics")
public class CardBasics {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "family")
    private String family;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(name = "small_img_url")
    private String smallImgUrl;
}
