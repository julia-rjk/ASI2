package service;

import model.message.CustomMessage;

public interface ReceiverService<T, E> {
    void receiveMessage(CustomMessage<T, E> customMessage);
}
