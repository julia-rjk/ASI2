package com.asi2.mschathistory.controller;

import com.asi2.mschathistory.constant.Router;
import com.asi2.mschathistory.service.message.MessageService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionBasic;
import model.dto.MessageDTO;
import model.message.CustomMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import service.SenderService;

import java.util.Date;
import java.util.List;
import java.util.Random;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping(Router.URL_MESSAGES)
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SenderService<MessageDTO, ActionBasic> senderService;

    @ApiOperation(value = "", nickname = "getAllMessages")
    @GetMapping()
    public List<MessageDTO> getAllMessages() {
        try {
            return messageService.findAll();
        } catch (Exception e) {
            log.error("Error when retrieving all messages : {}", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "getMessageByUserId")
    @GetMapping(value = "/user/{id}")
    public List<MessageDTO> getMessageByUserId(@PathVariable("id") Integer userId) {
        try {
            return messageService.findByUserId(userId);
        } catch (Exception e) {
            log.error("Error when retrieving message[{}]", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "getMessageByRoom")
    @GetMapping(value = {"room", "/room/{room}"})
    public List<MessageDTO> getMessageByRoom(@PathVariable(required = false) String room) {
        try {
            return messageService.findByRoom(room);
        } catch (Exception e) {
            log.error("Error when retrieving messages[{}]", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "saveMessage")
    @PostMapping()
    public void saveAsync(@RequestBody MessageDTO messageDTO) {
        try {
            senderService.sendMessage(new CustomMessage<>(
                    new Random().nextInt(),
                    ActionBasic.ADD,
                    ServletUriComponentsBuilder.fromCurrentContextPath().toUriString(),
                    String.valueOf(new Date()),
                    messageDTO
            ));
        } catch (Exception e) {
            log.error("Error when creating the message for the queue : {}", e.getMessage());
        }
    }
}
