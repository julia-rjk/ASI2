package com.asi2.mscard.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GlobalProperty {
    @Value("${webservice.url.cardbasics}")
    private String urlCardBasics;

    public String getUrlCardBasics() {
        return urlCardBasics;
    }

}
