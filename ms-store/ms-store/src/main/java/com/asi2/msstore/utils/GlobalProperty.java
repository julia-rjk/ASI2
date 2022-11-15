package com.asi2.msstore.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GlobalProperty {
    @Value("${webservice.url.cards}")
    private String urlCard;
    
    public String getUrlCard() {
        return urlCard;
    }

    @Value("${webservice.url.users}")
    private String urlUser;

    public String getUrlUser() {
        return urlUser;
    }

}
