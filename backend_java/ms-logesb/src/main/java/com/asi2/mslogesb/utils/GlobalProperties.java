package com.asi2.mslogesb.utils;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class GlobalProperties {
    @Value("${file.log.path}")
    private String pathFileLog;

    @Value("${file.log.name}")
    private String pathFileName;
}
