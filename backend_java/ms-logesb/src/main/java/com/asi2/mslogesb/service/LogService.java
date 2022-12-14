package com.asi2.mslogesb.service;

public interface LogService {

    /**
     * Method for saving a CustomMessage object from the ESB
     * into a file.
     * @param messageEsb The message from the ESB under the String format
     * @return true if success
     */
    Boolean saveToFile(String messageEsb);
}
