package model.dto;

import lombok.Data;

@Data
public class StoreTransactionDTO {
    private Long id;
    private Long userId;
    private Long cardId;
    private StoreAction storeAction;
}
