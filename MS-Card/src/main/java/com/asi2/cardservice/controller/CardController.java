package com.asi2.cardservice.controller;

import com.asi2.cardservice.constant.Router;
import com.asi2.cardservice.service.CardService;
import lombok.extern.slf4j.Slf4j;
import model.dto.CardDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
        } catch(Exception e) {
            log.error("Error when retrieving all cards : {}", e.getMessage());
            return null;
        }
    }
}
