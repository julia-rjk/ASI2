package com.asi2.msuser.service.receiver;

import com.asi2.msuser.service.user.UserService;
import com.asi2.msuser.utils.GlobalProperty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionBasic;
import model.dto.UserDTO;
import model.message.CustomMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Service;
import service.ReceiverService;
import service.SenderService;
import utils.WebService;

import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ReceiverServiceImpl implements ReceiverService<UserDTO, ActionBasic> {

    @Autowired
    private UserService userService;

    @Autowired
    private GlobalProperty globalProperty;

    @Override
    @JmsListener(destination = "${esb.user-messaging.queue.name}")
    public void receiveMessage(CustomMessage<UserDTO, ActionBasic> customMessage) {
        log.info("Message [{}] from [{}] depiled at {}: ", customMessage.getId(), customMessage.getCallBack(), customMessage.getDate());
        switch (customMessage.getAction()) {
            case ADD:
                userService.register(customMessage.getObjectContent(), customMessage.getCallBack());
                log.info("User [{}] created", customMessage.getObjectContent().getLogin());
                break;
            case UPDATE:
                userService.update(customMessage.getObjectContent());
                log.info("User [{}] updated", customMessage.getObjectContent().getLogin());
                break;
        }
        log.info("Message [{}] from [{}] proceeded at {}: ", customMessage.getId(), customMessage.getCallBack(), new Date());
        // TODO Gestion erreurs

        // Delete the password for the log service
        customMessage.getObjectContent().setPassword("*******");

        // Send to LogESB Service
        WebService.put(globalProperty.getUrlLogEsb(), customMessage);
    }


}
