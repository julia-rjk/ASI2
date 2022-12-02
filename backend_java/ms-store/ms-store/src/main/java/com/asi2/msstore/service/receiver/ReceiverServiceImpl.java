package com.asi2.msstore.service.receiver;

import com.asi2.msstore.service.store.StoreService;
import com.asi2.msstore.utils.GlobalProperty;
import com.asi2.msstorepublic.model.StoreOrder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionStore;
import model.dto.StoreAction;
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
public class ReceiverServiceImpl implements ReceiverService<StoreOrder, ActionStore> {

    @Autowired
    private StoreService storeService;

    @Autowired
    private GlobalProperty globalProperty;

    @Override
    @JmsListener(destination = "${esb.store-messaging.queue.name}")
    public void receiveMessage(CustomMessage<StoreOrder, ActionStore> customMessage) {
        log.info("Message [{}] from [{}] depiled at {}: ", customMessage.getId(), customMessage.getCallBack(), customMessage.getDate());
        switch (customMessage.getAction()) {
            case BUY:
                storeService.buyCard(customMessage.getObjectContent().getUser_id(), customMessage.getObjectContent().getCard_id());
                log.info("Store Message [BUY] treated");
                break;
            case SELL:
                storeService.sellCard(customMessage.getObjectContent().getUser_id(), customMessage.getObjectContent().getCard_id());
                log.info("Store Message [SELL] treated");
                break;
        }
        log.info("Message [{}] from [{}] proceeded at {}. ", customMessage.getId(), customMessage.getCallBack(), new Date());

        // TODO Gestion erreurs

        // Send to LogESB Service
        WebService.put(globalProperty.getUrlLog(), customMessage);
    }
}
