package com.asi2.mschathistory.service.message;

import model.dto.MessageDTO;

import java.util.List;

public interface MessageService {
    List<MessageDTO> findAll();

    List<MessageDTO> findByUserId(Integer userId);

    List<MessageDTO> findByRoom(String room);

    Boolean saveMessage(MessageDTO messageDto);
}
