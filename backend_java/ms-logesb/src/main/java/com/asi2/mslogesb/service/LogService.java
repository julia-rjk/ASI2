package com.asi2.mslogesb.service;

import model.message.CustomMessage;

public interface LogService {

    /**
     * Method for saving a CustomMessage object from the ESB
     * into a file.
     * @param messageEsb The message from the ESB
     * @return true if success
     */
    Boolean saveToFile(String queueName, CustomMessage messageEsb);
}
