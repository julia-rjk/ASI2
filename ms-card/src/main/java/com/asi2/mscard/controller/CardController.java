package com.asi2.mscard.controller;

import lombok.extern.slf4j.Slf4j;
import model.dto.CardDTO;
import model.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.asi2.mscard.constant.Router;
import com.asi2.mscard.service.CardService;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping(Router.URL_CARD)
public class CardController {

    @Autowired
    private CardService cardService;

    @GetMapping()
    public List<CardDTO> getAllCards() {
        List<CardDTO> cards = null;
        try {
            return cardService.findAll();
        } catch (Exception e) {
            log.error("Error when retrieving all cards : {}", e.getMessage());
            return null;
        }
    }

    @GetMapping("/{id}")
    public CardDTO getCardById(@PathVariable Long id) {
        CardDTO card = null;
        try {
            return cardService.findById(id);
        } catch (Exception e) {
            log.error("Error when retrieving card : {}", e.getMessage());
            return null;
        }
    }

    @PutMapping("/{id}")
    public CardDTO updateCard(@PathVariable Long id, @RequestBody @Validated CardDTO cardDTO) {
        try {
            return cardService.update(id, cardDTO);
        } catch (Exception e) {
            log.error("Error when login card : {}", e.getMessage());
            return null;
        }
    }

    @PostMapping()
    public CardDTO generateCard(@RequestParam Optional<Long> id) {
        try {
            return cardService.generateCard(id);
        } catch (Exception e) {
            log.error("An error occured during the generation of the card : {}", e.getMessage());
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public Boolean deleteCard(@PathVariable Long id) {
        try {
            return cardService.deleteCard(id);
        } catch (Exception e) {
            log.error("An error occurred when deleting the card : {}", e.getMessage());
            return Boolean.FALSE;
        }
    }
}