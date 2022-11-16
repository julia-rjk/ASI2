package com.asi2.mscard.controller;

import io.swagger.annotations.ApiOperation;
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
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping(Router.URL_CARD)
public class CardController {

    @Autowired
    private CardService cardService;

    @ApiOperation(value = "", nickname = "getAllCards")
    @GetMapping()
    public List<CardDTO> getAllCards() {
        try {
            return cardService.findAll();
        } catch (Exception e) {
            log.error("Error when retrieving all cards : {}", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "getAllCardsOnSell")
    @GetMapping("/onSell")
    public List<CardDTO> getAllCardsOnSell() {
        try {
            return cardService.findAll().stream().filter(cardDTO -> cardDTO.getUserId() == null).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error when retrieving all cards : {}", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "getCardById")
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

    @ApiOperation(value = "", nickname = "updateCard")
    @PutMapping("/{id}")
    public CardDTO updateCard(@PathVariable Long id, @RequestBody @Validated CardDTO cardDTO) {
        try {
            return cardService.update(id, cardDTO);
        } catch (Exception e) {
            log.error("Error when login card : {}", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "generateCard")
    @PostMapping()
    public CardDTO generateCard(@RequestParam(required=false) Long id) {
        try {
            return cardService.generateCard(id);
        } catch (Exception e) {
            log.error("An error occured during the generation of the card : {}", e.getMessage());
            return null;
        }
    }

    @ApiOperation(value = "", nickname = "deleteCard")
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
