package model.dto;

import lombok.Data;

@Data
public class MessageDTO {
    private Long id;
    private String timestamp;
    private Integer userId;
    private String room;
    private String text;
}
