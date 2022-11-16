package com.asi2.mscard.service.card;

import com.asi2.mscard.constant.Game;
import com.asi2.mscard.model.entity.Card;
import com.asi2.mscard.repository.CardDAO;
import com.asi2.mscard.utils.GlobalProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import model.dto.CardBasicsDTO;
import model.dto.CardDTO;
import model.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utils.Mapper;
import utils.WebService;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

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
            List<Card> listCard = cardDAO.findAll();
            List<CardDTO> cardDTOList = new ArrayList<>();
            for(Card card : listCard) {
                CardDTO cardDTO = Mapper.map(card, CardDTO.class);
                cardDTO.setModel(getModelOfCard(card));
                cardDTOList.add(cardDTO);
            }

            return cardDTOList;
        } catch (Exception e) {
            log.error("Error when finding all Cards : {}", e.getMessage());
            return null;
        }
    }

    // TODO Upgrade that sh*t (-> MS Store)
    @Override
    public List<CardDTO> findAllCardIdUserNull() {
        try {
            List<Card> listCard = cardDAO.findAll();
            List<CardDTO> cardDTOList = new ArrayList<>();
            for(Card card : listCard) {
                CardDTO cardDTO = Mapper.map(card, CardDTO.class);
                cardDTO.setModel(getModelOfCard(card));
                cardDTOList.add(cardDTO);
            }

            return cardDTOList.stream().filter(cardDTO -> cardDTO.getUserId() == null).collect(Collectors.toList());
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
                CardDTO cardDTO = Mapper.map(card, CardDTO.class);
                cardDTO.setModel(getModelOfCard(card));
                return cardDTO;
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
    public CardDTO generateCard(Long id) {

        // Get all card model from CardBasics service
        String request = globalProperty.getUrlCardBasics();
        String response = WebService.get(request);

        if (response != null && response.length() != 0) {
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
                CardBasicsDTO cardBasicsDTO = cardModelsList
                        .get(generateRandomIntegerValue(0, cardModelsList.size() - 1));

                card.setIdCardBasics(cardBasicsDTO.getId());
                card.setEnergy(generateRandomFloatValue(Game.ENERGY_MIN, Game.ENERGY_MAX));
                card.setHp(generateRandomFloatValue(Game.HP_MIN, Game.HP_MAX));
                card.setDefence(generateRandomFloatValue(Game.DEFENCE_MIN, Game.DEFENCE_MAX));
                card.setAttack(generateRandomFloatValue(Game.ATTACK_MIN, Game.ATTACK_MAX));
                card.setPrice(generateRandomFloatValue(Game.PRICE_MIN, Game.PRICE_MAX));

                // Set userID if id is present
                if (id != null) {
                    card.setUserId(id);
                }
                Card createdCard = save(card);
                // Update user if id is present and card is created
                if (id != null) {
                    // Get user
                    UserDTO user;
                    String userResponse = WebService.get(globalProperty.getUrlUser() + "/" + id);
                    // Mapping from JSON to DTO
                    if (userResponse != null) {
                        try {
                            ObjectMapper mapper = new ObjectMapper();
                            user = mapper.readValue(userResponse, UserDTO.class);
                        } catch (JsonMappingException e) {
                            log.error("Error when mapping JSON to DTO : {}", e.getMessage());
                            return null;
                        } catch (JsonProcessingException e) {
                            log.error("Error when processing JSON : {}", e.getMessage());
                            return null;
                        }
                    } else {
                        log.error("An error occured with the User Service or the service is not available");
                    }

                    return Mapper.map(createdCard, CardDTO.class);
                } else {
                    log.error("Error when generating a card");
                }
            }
        }
        return null;
    }

    @Override
    public Boolean deleteCard(Long id) {
        if (cardDAO.findById(id).isPresent()) {
            cardDAO.delete(cardDAO.findById(id).get());
            return Boolean.TRUE;
        } else {
            log.info("The card id[{}] does not exist", id);
            return Boolean.FALSE;
        }
    }

    @Override
    public CardDTO update(CardDTO cardDTO) {
        if (cardDAO.findById(cardDTO.getId()).isPresent()) {
            Card card = cardDAO.findById(cardDTO.getId()).get();

            // Mapping
            card.setAttack(cardDTO.getAttack());
            card.setDefence(cardDTO.getDefence());
            card.setEnergy(cardDTO.getEnergy());
            card.setHp(cardDTO.getHp());
            card.setPrice(cardDTO.getPrice());
            card.setUserId(cardDTO.getUserId());
            save(card);
        } else {
            log.info("The card does not exist");
        }

        return cardDTO;
    }

    private Card save(Card card) {
        try {
            Card res = cardDAO.save(card);
            return res;
        } catch (Exception e) {
            log.error("Error when saving entity to database : {}", e.getMessage());
            return null;
        }
    }

    private Float generateRandomFloatValue(Float min, Float max) {
        Random random = new Random();
        return min + random.nextFloat() * (max - min);
    }

    private int generateRandomIntegerValue(int min, int max) {
        return new Random().nextInt((max - min) + 1) + min;
    }

    private CardBasicsDTO getModelOfCard(Card card) {
        // Get the card model from CardBasics service
        String request = globalProperty.getUrlCardBasics() + "/" + card.getIdCardBasics();
        String response = WebService.get(request);

        if (response != null) {
            CardBasicsDTO cardBasicsDTO;
            try {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(response, CardBasicsDTO.class);
            } catch (JsonProcessingException e) {
                log.error("Error when mapping card models : {}", e.getMessage());
            }
        } else {
            log.error("Error when getting the model of card from the CardBasics Service");
        }

        return null;
    }
}
