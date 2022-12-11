package com.asi2.mschathistory.service.message;

import com.asi2.mschathistory.model.entity.Message;
import com.asi2.mschathistory.repository.MessageDAO;
import com.asi2.mschathistory.utils.GlobalProperty;
import lombok.extern.slf4j.Slf4j;
import model.dto.MessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utils.Mapper;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageDAO messageDAO;

    @Autowired
    private GlobalProperty globalProperty;

    @Override
    public List<MessageDTO> findAll() {
        try {
            List<Message> messages = messageDAO.findAll();
            List<MessageDAO> userDTOS = new ArrayList<>();

            for (Message message : messages) {

            }

            return Mapper.mapList(messageDAO.findAll(), MessageDTO.class);
        } catch (Exception e) {
            log.error("Error when finding all messages : {}", e.getMessage());
            return null;
        }
    }

    @Override
    public List<MessageDTO> findByUserId(Integer userId) {
        try {
            List<Message> messages = messageDAO.findAll();
            List<Message> messagesByUserId = new ArrayList<>();

            for (Message message : messages) {
                if (message.getUserId() == userId) messagesByUserId.add(message);
            }

            return Mapper.mapList(messagesByUserId, MessageDTO.class);
        } catch (Exception e) {
            log.error("Error when finding all messages : {}", e.getMessage());
            return null;
        }
    }

    @Override
    public List<MessageDTO> findByRoom(String room) {
        try {
            List<Message> messages = messageDAO.findAll();
            List<Message> messagesByRoom = new ArrayList<>();

            for (Message message : messages) {
                log.info("room name :  {} compared to {}", message.getRoom(), room);
                if ((message.getRoom() == null && room == null) // general room
                 || (message.getRoom() != null 
                 && message.getRoom().equals(room))// specific room
                 ) messagesByRoom.add(message);
            }

            return Mapper.mapList(messagesByRoom, MessageDTO.class);
        } catch (Exception e) {
            log.error("Error when finding all messages : {}", e.getMessage());
            return null;
        }
    }

    @Override
    public Boolean saveMessage(MessageDTO messageDto) {
        try {

            Message message = new Message();
            message.setUserId(messageDto.getUserId());
            message.setRoom(messageDto.getRoom());
            message.setMessage(messageDto.getMessage());
            message.setDate(new java.sql.Date(messageDto.getDate().getTime()));

            messageDAO.save(message);
            return Boolean.TRUE;
        } catch (Exception e) {
            log.error("Error when saving entity to database : {}", e.getMessage());
            return Boolean.FALSE;
        }
    }

}
