package com.asi2.msstore.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import model.dto.UserDTO;
import utils.WebService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import model.dto.CardDTO;
import com.asi2.msstorepublic.model.StoreAction;
import com.asi2.msstore.model.StoreTransaction;
import com.asi2.msstore.utils.GlobalProperty;

@Slf4j
@Service
public class StoreService {
	private GlobalProperty globalProperty;
	ObjectMapper mapper = new ObjectMapper();

	private final StoreRepository storeRepository;

	public StoreService(StoreRepository storeRepository) {
		this.storeRepository = storeRepository;
	}

	public boolean buyCard(Integer user_id, Integer card_id) {
		// Get card
		CardDTO card;
		String cardResponse = WebService.get(globalProperty.getUrlCard() + "/" + card_id);
		// Mapping from JSON to DTO
		if (cardResponse != null) {
			try {
				card = mapper.readValue(cardResponse, CardDTO.class);
			} catch (JsonMappingException e) {
				log.error("Error when mapping JSON to DTO : {}", e.getMessage());
				return false;
			} catch (JsonProcessingException e) {
				log.error("Error when processing JSON : {}", e.getMessage());
				return false;
			}
		} else {
			log.error("An error occured with the Card Service or the service is not available");
			return false;
		}

		// Get user
		UserDTO user;
		String userResponse = WebService.get(globalProperty.getUrlUser() + "/" + user_id);
		// Mapping from JSON to DTO
		if (userResponse != null) {
			try {
				user = mapper.readValue(userResponse, UserDTO.class);
			} catch (JsonMappingException e) {
				log.error("Error when mapping JSON to DTO : {}", e.getMessage());
				return false;
			} catch (JsonProcessingException e) {
				log.error("Error when processing JSON : {}", e.getMessage());
				return false;
			}
		} else {
			log.error("An error occured with the User Service or the service is not available");
			return false;
		}
		if (user.getAccount() > card.getPrice()) {
			// Update user account
			List<CardDTO> userCards = user.getCards();
			userCards.add(card);
			user.setCards(userCards);
			user.setAccount(user.getAccount() - card.getPrice());
			WebService.put(globalProperty.getUrlUser() + "/" + user_id, user);

			// Add transaction
			StoreTransaction sT = new StoreTransaction(user_id, card_id, StoreAction.BUY);
			storeRepository.save(sT);
			return true;
		} else {
			return false;
		}
	}

	public boolean sellCard(Integer user_id, Integer card_id) {
		// Get card
		CardDTO card;
		String cardResponse = WebService.get(globalProperty.getUrlCard() + "/" + card_id);
		if (cardResponse != null) {
			try {
				card = mapper.readValue(cardResponse, CardDTO.class);
			} catch (JsonMappingException e) {
				log.error("Error when mapping JSON to DTO : {}", e.getMessage());
				return false;
			} catch (JsonProcessingException e) {
				log.error("Error when processing JSON : {}", e.getMessage());
				return false;
			}

		} else {
			log.error("An error occured with the Card Service or the service is not available");
			return false;
		}
		// Get user
		UserDTO user;
		String userResponse = WebService.get(globalProperty.getUrlUser() + "/" + user_id);
		if (userResponse != null) {
			try {
				user = mapper.readValue(userResponse, UserDTO.class);
			} catch (JsonMappingException e) {
				log.error("Error when mapping JSON to DTO : {}", e.getMessage());
				return false;
			} catch (JsonProcessingException e) {
				log.error("Error when processing JSON : {}", e.getMessage());
				return false;
			}

		} else {
			log.error("An error occured with the User Service or the service is not available");
			return false;
		}

		if (user.getCards().contains(card)) {
			// Update user account
			List<CardDTO> userCards = user.getCards();
			userCards.remove(card);
			user.setCards(userCards);
			user.setAccount(user.getAccount() + card.getPrice());
			WebService.put(globalProperty.getUrlUser() + "/" + user_id, user);

			// Update card
			card.setIdUser(null);
			WebService.put(globalProperty.getUrlCard() + "/" + card_id, card);

			// Add transaction
			StoreTransaction sT = new StoreTransaction(user_id, card_id, StoreAction.SELL);
			storeRepository.save(sT);
			return true;
		} else {
			return false;
		}

	}

	public List<StoreTransaction> getAllTransactions() {
		List<StoreTransaction> sTList = new ArrayList<>();
		this.storeRepository.findAll().forEach(sTList::add);
		return sTList;

	}

}
