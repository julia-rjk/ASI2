package com.asi2.cardbasicsservice.service;

import com.asi2.cardbasicsservice.model.CardBasics;
import com.asi2.cardbasicsservice.repository.CardBasicsDAO;
import lombok.extern.slf4j.Slf4j;
import model.dto.CardBasicsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utils.Mapper;

import java.util.List;

@Slf4j
@Service
public class CardBasicsServiceImpl implements CardBasicsService {
    @Autowired
    private CardBasicsDAO cardBasicsDAO;

    @Override
    public List<CardBasicsDTO> findAll() {
        try {
            return Mapper.mapList(cardBasicsDAO.findAll(), CardBasicsDTO.class);
        } catch (Exception e) {
            log.error("Error when finding all model of Cards : {}", e.getMessage());
            return null;
        }
    }

    @Override
    public CardBasicsDTO findById(Long id) {
        try {
            if (cardBasicsDAO.findById(id).isPresent()) {
                CardBasics cardBasics = cardBasicsDAO.findById(id).get();
                return Mapper.map(cardBasics, CardBasicsDTO.class);
            } else {
                log.info("The model of card id=[{}] does not exist", id);
            }
        } catch (Exception e) {
            log.error("Error when finding the model of card[{}] : {} ", id, e.getMessage());
        }

        return null;
    }

    @Override
    public Boolean add(CardBasicsDTO cardBasicsDTO) {
        CardBasics cardBasics = new CardBasics();

        // Save to get an ID
        if(save(cardBasics)) {
            cardBasicsDTO.setId(cardBasics.getId());

            // Mapping DTO to Entity
            cardBasics = Mapper.map(cardBasicsDTO, CardBasics.class);

            if(cardBasics != null && save(cardBasics)) {
                return Boolean.TRUE;
            }
        }
        return Boolean.FALSE;
    }

    @Override
    public Boolean update(CardBasicsDTO cardBasicsDTO) {
        if(cardBasicsDAO.findById(cardBasicsDTO.getId()).isPresent()) {
            CardBasics cardBasics = cardBasicsDAO.findById(cardBasicsDTO.getId()).get();

            // Mapping of the cardBasics
            cardBasics = Mapper.map(cardBasicsDTO, CardBasics.class);

            // Saving
            if(cardBasics != null && save(cardBasics)) {
                return Boolean.TRUE;
            }
        } else {
            log.info("The model of card id=[{}] does not exist", cardBasicsDTO.getId());
        }

        return Boolean.FALSE;
    }

    @Override
    public Boolean delete(Long id) {
        // TODO When it will be useful
        return null;
    }

    private Boolean save(CardBasics cardBasics) {
        try {
            cardBasicsDAO.save(cardBasics);
            return Boolean.TRUE;
        } catch (Exception e) {
            log.error("Error when saving entity to database : {}", e.getMessage());
            return Boolean.FALSE;
        }
    }
}
