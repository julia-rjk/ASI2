package model.dto;

import lombok.Data;

@Data
public class CardBasicsDTO {
    private Long id;
    private String name;
    private String description;
    private String family;
    private String imgUrl;
    private String smallImgUrl;
    private String attackName;

}
