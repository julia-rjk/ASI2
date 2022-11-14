package com.asi2.mscardBasic.service;

import model.dto.CardBasicsDTO;

import java.util.List;

public interface CardBasicsService {
    List<CardBasicsDTO> findAll();

    CardBasicsDTO findById(Long id);

    Boolean add(CardBasicsDTO cardBasicsDTO);

    Boolean update(CardBasicsDTO cardBasicsDTO);

    Boolean delete(Long id);
}
