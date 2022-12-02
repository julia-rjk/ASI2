package com.asi2.mschathistory.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GlobalProperty {
    @Value("${webservice.url.logesb}")
    private String urlLog;

    public String getUrlLogEsb() {
        return urlLog;
    }
}
