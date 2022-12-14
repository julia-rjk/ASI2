package com.asi2.mslogesb.service;

import com.asi2.mslogesb.utils.GlobalProperties;
import lombok.extern.slf4j.Slf4j;
import model.message.CustomMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
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
            // Write into the log file
            try (FileWriter fw = new FileWriter(
                    Objects.requireNonNull(classLoader.getResource(".")).getFile() + globalProperties.getPathFileName(),
                    true); BufferedWriter writer = new BufferedWriter(fw);) {
                writer.write(messageEsb);
                writer.newLine();
                writer.close();
                return Boolean.TRUE;
            } catch (IOException e) {
                log.error("An error occurred while writing into file : {}", e.getMessage());
            }
        }

        return Boolean.FALSE;
    }
}
