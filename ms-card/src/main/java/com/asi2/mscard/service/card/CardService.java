package com.asi2.mscard.service.card;

import model.dto.CardDTO;
import model.dto.UserDTO;

import java.util.List;
import java.util.Optional;

public interface CardService {
    List<CardDTO> findAll();

    List<CardDTO> findAllCardIdUserNull();

    CardDTO findById(Long id);

    CardDTO generateCard(Long id);

    Boolean deleteCard(Long id);

    CardDTO update(CardDTO cardDTO);

}
