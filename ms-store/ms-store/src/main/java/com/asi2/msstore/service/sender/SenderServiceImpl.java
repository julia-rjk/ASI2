package com.asi2.msstore.service.sender;

import com.asi2.msstorepublic.model.StoreOrder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionStore;
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
public class SenderServiceImpl implements SenderService<StoreOrder, ActionStore> {

    private final JmsTemplate jmsTemplate;

    private static final String QUEUE_KEY = "esb.store-messaging.queue.name";

    private String queue;

    private final Environment environment;

    @PostConstruct
    public void init() {
        queue = environment.getProperty(QUEUE_KEY);
    }

    @Override
    public void sendMessage(CustomMessage<StoreOrder, ActionStore> customMessage) {
        log.info("Enqueued Message : " + customMessage.toString());
        jmsTemplate.convertAndSend(queue, customMessage);
    }
}
