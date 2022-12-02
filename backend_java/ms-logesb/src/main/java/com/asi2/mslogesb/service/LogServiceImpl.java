package com.asi2.mslogesb.service;

import com.asi2.mslogesb.utils.GlobalProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.Objects;

@Slf4j
@Service
public class LogServiceImpl implements LogService {
    @Autowired
    private GlobalProperties globalProperties;

    @Override
    public Boolean saveToFile(String messageEsb) {
        File file;
        ClassLoader classLoader = getClass().getClassLoader();

        // Get the ressource folder
        if (classLoader != null) {
            // Get the log file
            file = new File(Objects.requireNonNull(classLoader.getResource(".")).getFile() + globalProperties.getPathFileName());
            // Write into the log file
            try (Writer writer = new BufferedWriter(new FileWriter(file))) {
                writer.write(messageEsb);
                return Boolean.TRUE;
            } catch (IOException e) {
                log.error("An error occurred while writing into file : {}", e.getMessage());
            }
        }

        return Boolean.FALSE;
    }
}
