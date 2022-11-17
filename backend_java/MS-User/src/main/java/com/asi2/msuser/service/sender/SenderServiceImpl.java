package com.asi2.msuser.service.sender;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionBasic;
import model.dto.UserDTO;
import model.message.CustomMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import service.SenderService;

import javax.annotation.PostConstruct;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Data
public class SenderServiceImpl implements SenderService<UserDTO, ActionBasic> {

    private final JmsTemplate jmsTemplate;
    private static final String QUEUE_KEY = "esb.user-messaging.queue.name";
    private String queue;
    private final Environment environment;

    @PostConstruct
    public void init() {
        queue = environment.getProperty(QUEUE_KEY);
    }

    @Override
    public void sendMessage(CustomMessage<UserDTO, ActionBasic> customMessage) {
        log.info("Enqueued Message : " + customMessage.toString());
        jmsTemplate.convertAndSend(queue, customMessage);
    }
}
