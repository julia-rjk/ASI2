package com.asi2.cardservice.service;

import com.asi2.cardservice.constant.Game;
import com.asi2.cardservice.model.Card;
import com.asi2.cardservice.repository.CardDAO;
import com.asi2.cardservice.utils.GlobalProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import model.dto.CardBasicsDTO;
import model.dto.CardDTO;
import model.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utils.Mapper;
import utils.WebService;

import java.util.List;
import java.util.Random;

@Slf4j
@Service
public class CardServiceImpl implements CardService {

    @Autowired
    private CardDAO cardDAO;

    @Autowired
    private GlobalProperty globalProperty;

    @Override
    public List<CardDTO> findAll() {
        try {
            return Mapper.mapList(cardDAO.findAll(), CardDTO.class);
        } catch (Exception e) {
            log.error("Error when finding all Cards : {}", e.getMessage());
            return null;
        }
    }

    @Override
    public CardDTO findById(Long id) {
        try {
            if (cardDAO.findById(id).isPresent()) {
                Card card = cardDAO.findById(id).get();
                return Mapper.map(card, CardDTO.class);
            } else {
                log.info("The card[{}] doesn't exist", id);
            }
        } catch (Exception e) {
            log.error("Error when finding card[{}] : {} ", id, e.getMessage());
        }

        return null;
    }

    /**
     * Method to generate card from a model of card.
     * <p>
     * This method call the CardBasics Service to get a model of card.
     *
     * @return the card generated
     */
    @Override
    public CardDTO generateCard(Long idUser) {

        // Get all card model from CardBasics service
        String request = globalProperty.getUrlCardBasics();
        String response = WebService.get(request);

        // Mapping all card models
        List<CardBasicsDTO> cardModelsList;
        try {
            ObjectMapper mapper = new ObjectMapper();
            cardModelsList = mapper.readValue(response, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            log.error("Error when mapping card models : {}", e.getMessage());
            return null;
        }

        // Generate card from models with random stats
        if (cardModelsList != null) {
            Card card = new Card();
            CardBasicsDTO cardBasicsDTO = cardModelsList.get(generateRandomIntegerValue(0, cardModelsList.size()));

            card.setIdCardBasics(cardBasicsDTO.getId());
            card.setIdUser(idUser);
            card.setEnergy(generateRandomFloatValue(Game.ENERGY_MIN, Game.ENERGY_MAX));
            card.setHp(generateRandomFloatValue(Game.HP_MIN, Game.HP_MAX));
            card.setDefence(generateRandomFloatValue(Game.DEFENCE_MIN, Game.DEFENCE_MAX));
            card.setAttack(generateRandomFloatValue(Game.ATTACK_MIN, Game.ATTACK_MAX));
            card.setPrice(generateRandomFloatValue(Game.PRICE_MIN, Game.PRICE_MAX));

            if(save(card)) {
                return Mapper.map(card, CardDTO.class);
            } else {
                log.error("Error when generating a card");
            }
        }

        return null;
    }

    private Boolean save(Card card) {
        try {
            cardDAO.save(card);
            return Boolean.TRUE;
        } catch (Exception e) {
            log.error("Error when saving entity to database : {}", e.getMessage());
            return Boolean.FALSE;
        }
    }

    private Float generateRandomFloatValue(Float min, Float max) {
        Random random = new Random();
        return min + random.nextFloat() * (max - min);
    }

    private int generateRandomIntegerValue(int min, int max) {
        Random random = new Random();
        return min + random.nextInt() * (max - min);
    }
}
