package com.asi2.cardbasicsservice.controller;

import com.asi2.cardbasicsservice.constant.Router;
import com.asi2.cardbasicsservice.service.CardBasicsService;
import lombok.extern.slf4j.Slf4j;
import model.dto.CardBasicsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(Router.URL_CARDBASICS)
public class CardBasicsController {
    @Autowired
    private CardBasicsService cardBasicsService;

    @GetMapping
    public List<CardBasicsDTO> getAllCardBasics() {
        List<CardBasicsDTO> cardBasicsList = null;
        try {
            return cardBasicsService.findAll();
        } catch (Exception e) {
            log.error("Error when retrieving all model of cards : {}", e.getMessage());
            return null;
        }
    }

    @GetMapping("/{id}")
    public CardBasicsDTO getCardBasicsById(@PathVariable Long id) {
        CardBasicsDTO model = null;
        try {
            return cardBasicsService.findById(id);
        } catch (Exception e) {
            log.error("Error when retrieving all model of cards : {}", e.getMessage());
            return null;
        }
    }

    @PostMapping
    public CardBasicsDTO createCardBasics(@RequestBody @Validated CardBasicsDTO cardBasicsDTO) {
        try {
            if (cardBasicsService.add(cardBasicsDTO)) {
                return cardBasicsDTO;
            } else {
                log.error("Error when creating the model of card");
                return null;
            }
        } catch (Exception e) {
            log.error("Error when creating the model of card : {}", e.getMessage());
            return null;
        }
    }

}
