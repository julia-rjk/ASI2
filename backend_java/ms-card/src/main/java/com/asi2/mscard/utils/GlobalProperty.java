package com.asi2.mscard.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GlobalProperty {
    @Value("${webservice.url.cardbasics}")
    private String urlCardBasics;

    @Value("${webservice.url.users}")
    private String urlUser;

    @Value("${webservice.url.logesb}")
    private String urlLog;

    public String getUrlCardBasics() {
        return urlCardBasics;
    }

    public String getUrlUser() {
        return urlUser;
    }

    public String getUrlLogEsb() {
        return urlLog;
    }
}
