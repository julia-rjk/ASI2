package model.dto;

import lombok.Data;

@Data
public class CardDTO {
    private Long id;
    private Long idCardBasics;
    private Long idUser;
    private Float energy;
    private Float hp;
    private Float defence;
    private Float attack;
    private String price;
}
