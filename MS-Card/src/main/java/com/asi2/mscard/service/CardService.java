package com.asi2.mscard.service;

import model.dto.CardDTO;
import model.dto.UserDTO;

import java.util.List;

public interface CardService {
    List<CardDTO> findAll();

    CardDTO findById(Long id);

    CardDTO generateCard(UserDTO userDTO);

    Boolean deleteCard(Long id);

    CardDTO update(Long id, CardDTO cardDTO);

}
