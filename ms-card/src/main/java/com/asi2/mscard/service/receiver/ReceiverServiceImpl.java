package com.asi2.mscard.service.receiver;

import com.asi2.mscard.service.card.CardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionBasic;
import model.dto.CardDTO;
import model.message.CustomMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;
import service.ReceiverService;

import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ReceiverServiceImpl implements ReceiverService<CardDTO, ActionBasic> {

    @Autowired
    private CardService cardService;

    @Override
    @JmsListener(destination = "${card-messaging.queue.name}")
    public void receiveMessage(CustomMessage<CardDTO, ActionBasic> customMessage) {
        log.info("Message [{}] from [{}] depiled at {}: ", customMessage.getId(), customMessage.getCallBack(), customMessage.getDate());
        switch (customMessage.getAction()) {
            case ADD:
                // TODO When generating card for user completely async
                break;
            case UPDATE:
                cardService.update(customMessage.getObjectContent());
                log.info("Card id=[{}] updated", customMessage.getObjectContent().getId());
                break;
        }
        log.info("Message [{}] from [{}] proceeded at {}: ", customMessage.getId(), customMessage.getCallBack(), new Date());
    }
}
