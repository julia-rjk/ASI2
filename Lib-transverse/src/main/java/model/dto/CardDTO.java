package model.dto;

import lombok.Data;

@Data
public class CardDTO {
    private Long id;
    private CardBasicsDTO model;
    private Long userId;
    private Float energy;
    private Float hp;
    private Float defence;
    private Float attack;
    private Float price;
}
