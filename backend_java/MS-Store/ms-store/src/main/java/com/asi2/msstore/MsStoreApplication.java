package com.asi2.msstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Store Rest Api", version = "1.0", description = "Information about the Store Rest API and how to interact with"))
public class MsStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsStoreApplication.class, args);
	}

}
