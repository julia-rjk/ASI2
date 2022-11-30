package com.asi2.mschathistory.controller;

import com.asi2.mschathistory.constant.Router;
import com.asi2.mschathistory.service.message.MessageService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import model.dto.MessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping(Router.URL_MESSAGES)
public class MessageController {

    @Autowired
    private MessageService messageService;

    // @Autowired
    // private SenderService<MessageDTO, ActionBasic> senderService;

    @ApiOperation(value = "", nickname = "getAllUsers")
    @GetMapping()
    public List<MessageDTO> getAllMessages() {
        List<MessageDTO> messages = null;
        try {
            return messageService.findAll();
        } catch (Exception e) {
            log.error("Error when retrieving all users : {}", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "getMessageByUserId")
    @GetMapping(value = "/user/{id}")
    public List<MessageDTO> getMessageByUserId(@PathVariable("id") Integer userId) {
        MessageDTO messageDTO = null;
        try {
            return messageService.findByUserId(userId);
        } catch (Exception e) {
            log.error("Error when retrieving message[{}]", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "getMessageByUserId")
    @GetMapping(value = "/room/{name}")
    public List<MessageDTO> getMessageByRoom(@PathVariable("name") String room) {
        MessageDTO messageDTO = null;
        try {
            return messageService.findByRoom(room);
        } catch (Exception e) {
            log.error("Error when retrieving message[{}]", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "insert")
    @PostMapping()
    public Boolean insert(@RequestBody MessageDTO messageDTO) {
        try {
            return messageService.insert(messageDTO);

        } catch (Exception e) {
            log.error("Error when creating the message for the queue : {}", e.getMessage());

            return Boolean.FALSE;
        }
    }

}
