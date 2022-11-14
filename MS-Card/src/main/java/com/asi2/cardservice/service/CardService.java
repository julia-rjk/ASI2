package com.asi2.cardservice.service;

import model.dto.CardDTO;
import model.dto.UserDTO;

import java.util.List;

public interface CardService {
    List<CardDTO> findAll();

    CardDTO findById(Long id);

    CardDTO generateCard(UserDTO userDTO);
}
