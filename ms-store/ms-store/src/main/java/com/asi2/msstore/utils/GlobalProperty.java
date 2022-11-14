package com.asi2.msstore.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GlobalProperty {
    @Value("${webservice.url.cards}")
    private String urlCard;

    @Value("${webservice.url.users}")
    private String urlUser;

    public String getUrlCard() {
        return urlCard;
    }

    public String getUrlUser() {
        return urlUser;
    }

}
