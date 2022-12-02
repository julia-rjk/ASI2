package com.asi2.mschathistory.service.receiver;

import com.asi2.mschathistory.service.message.MessageService;
import com.asi2.mschathistory.utils.GlobalProperty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionBasic;
import model.dto.CardDTO;
import model.dto.MessageDTO;
import model.message.CustomMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;
import service.ReceiverService;
import utils.WebService;

import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ReceiverServiceImpl implements ReceiverService<MessageDTO, ActionBasic> {

    @Autowired
    private MessageService messageService;

    @Autowired
    private GlobalProperty globalProperty;

    @Override
    @JmsListener(destination = "${chat-messaging.queue.name}")
    public void receiveMessage(CustomMessage<MessageDTO, ActionBasic> customMessage) {
        log.info("Message [{}] from [{}] depiled at {}: ", customMessage.getId(), customMessage.getCallBack(), customMessage.getDate());
        switch (customMessage.getAction()) {
            case ADD:
                messageService.saveMessage(customMessage.getObjectContent());
                break;
            case UPDATE:
                // TODO When useful
                break;
        }
        log.info("Message [{}] from [{}] proceeded at {}: ", customMessage.getId(), customMessage.getCallBack(), new Date());

        // Send to LogESB Service
        WebService.put(globalProperty.getUrlLogEsb(), customMessage);

        // TODO Gestion erreur TMTC
    }
}
