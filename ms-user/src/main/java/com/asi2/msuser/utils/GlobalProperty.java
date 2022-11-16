package com.asi2.msuser.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GlobalProperty {
    @Value("${webservice.url.card}")
    private String urlCard;

    @Value("${esb.user-messaging.queue.name}")
    private String queueName;

    @Value("${webservice.url.card.generateCard.async}")
    private String urlGenerateCardAsync;

    public String getUrlCard() {
        return urlCard;
    }

    public String getQueueName() {
        return queueName;
    }

    public String getUrlGenerateCardAsync() {
        return urlGenerateCardAsync;
    }
}
