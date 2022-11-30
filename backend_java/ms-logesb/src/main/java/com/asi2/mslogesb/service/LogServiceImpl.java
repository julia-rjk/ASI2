package com.asi2.mslogesb.service;

import com.asi2.mslogesb.utils.GlobalProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import java.io.*;

@Slf4j
@Service
public class LogServiceImpl implements LogService {
    @Autowired
    private GlobalProperties globalProperties;

    @Override
    public Boolean saveToFile(String queueName, CustomMessage messageEsb) {
        File file = null;

        try {
            file = new File(globalProperties.getPathFileLog() + queueName + "/" + globalProperties.getPathFileName());
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        } catch (FileNotFoundException e) {
            log.error("An error occurred while opening file : {}", e.getMessage());
        }
        try (Writer writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(messageEsb.toString());
            return Boolean.TRUE;
        } catch (IOException e) {
            log.error("An error occurred while writing into file : {}", e.getMessage());
        }

        return Boolean.FALSE;
    }
}
