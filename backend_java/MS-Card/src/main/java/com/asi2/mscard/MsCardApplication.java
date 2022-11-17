package com.asi2.mscard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Card Rest Api", version = "1.0", description = "Information about the Card Rest API and how to interact with"))
public class MsCardApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsCardApplication.class, args);
    }
}
