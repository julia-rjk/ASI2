package com.asi2.msstore.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import model.dto.UserDTO;
import utils.WebService;
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
			card = mapper.readValue(cardResponse, CardDTO.class);
		} else {
			log.error("An error occured with the Card Service or the service is not available");
			return false;
		}

		// Get user
		UserDTO user;
		String userResponse = WebService.get(globalProperty.getUrlUser() + "/" + user_id);
		// Mapping from JSON to DTO
		if (userResponse != null) {
			user = mapper.readValue(userResponse, UserDTO.class);
		} else {
			log.error("An error occured with the User Service or the service is not available");
			return false;
		}
		if (user.account > card.price) {
			user.addCard(card);
			user.setAccount(user.getAccount() - card.getPrice());
			userService.updateUser(user);
			StoreTransaction sT = new StoreTransaction(user_id, card_id, StoreAction.BUY);
			storeRepository.save(sT);
			return true;
		} else {
			return false;
		}
	}

	public boolean sellCard(Integer user_id, Integer card_id) {
		Optional<UserDTO> u_option = userService.getUser(user_id);
		Optional<CardDTO> c_option = cardService.getCard(card_id);
		if (!u_option.isPresent() || !c_option.isPresent()) {
			return false;
		}
		UserDTO u = u_option.get();
		CardDTO c = c_option.get();

		c.setUser(null);
		cardService.updateCard(c);
		u.setAccount(u.getAccount() + c.computePrice());
		userService.updateUser(u);
		StoreTransaction sT = new StoreTransaction(user_id, card_id, StoreAction.SELL);
		storeRepository.save(sT);
		return true;
	}

	public List<StoreTransaction> getAllTransactions() {
		List<StoreTransaction> sTList = new ArrayList<>();
		this.storeRepository.findAll().forEach(sTList::add);
		return sTList;

	}

}
