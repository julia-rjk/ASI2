package com.asi2.mscard.service;

import model.dto.CardDTO;
import model.dto.UserDTO;

import java.util.List;
import java.util.Optional;

public interface CardService {
    List<CardDTO> findAll();

    CardDTO findById(Long id);

    CardDTO generateCard(Optional<Long> id);

    Boolean deleteCard(Long id);

    CardDTO update(Long id, CardDTO cardDTO);

}
