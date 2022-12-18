package com.asi2.msauth.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GlobalProperty {
    @Value("${jwt.secret}")
    private String secret;

    public String getSecret() {
        return secret;
    }
}
