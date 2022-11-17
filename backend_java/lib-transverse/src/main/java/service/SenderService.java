package service;

import model.message.CustomMessage;

public interface SenderService<T, E> {
    void sendMessage(CustomMessage<T, E> customMessage);
}
