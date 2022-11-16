package com.asi2.msuser.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GlobalProperty {
    @Value("${webservice.url.card}")
    private String urlCard;

    public String getUrlCard() {
        return urlCard;
    }

}
