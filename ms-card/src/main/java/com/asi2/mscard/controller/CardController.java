package com.asi2.mscard.controller;

import io.swagger.annotations.ApiOperation;
import com.asi2.mscard.constant.Router;
import com.asi2.mscard.service.card.CardService;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionBasic;
import model.dto.CardDTO;
import model.message.CustomMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import service.SenderService;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Random;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@Slf4j
@RestController
@RequestMapping(Router.URL_CARD)
public class CardController {

    @Autowired
    private CardService cardService;

    @Autowired
    private SenderService<CardDTO, ActionBasic> senderService;

    @ApiOperation(value = "", nickname = "getAllCards")
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
    @PutMapping()
    public CardDTO updateCardAsync(@RequestBody @Validated CardDTO cardDTO) {
        try {
            senderService.sendMessage(new CustomMessage<>(
                    new Random().nextLong(),
                    ActionBasic.UPDATE,
                    ServletUriComponentsBuilder.fromCurrentContextPath().toUriString(),
                    String.valueOf(new Date()),
                    cardDTO
            ));

        } catch (Exception e) {
            log.error("Error when creating the message for the queue : {}", e.getMessage());
        }

        return null;
    }

    @ApiOperation(value = "", nickname = "generateCard")
    @PostMapping()
    public CardDTO generateCard(@RequestParam(required = false) Long id) {
        try {
            // TODO Async version
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
