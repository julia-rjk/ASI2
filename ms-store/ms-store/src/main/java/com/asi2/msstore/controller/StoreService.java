package com.asi2.msstore.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

// import com.asi2.mscard.Controller.CardModelService;
// import com.asi2.msuser.controller.UserService;
import com.asi2.transversa.model.CardModel;
import com.asi2.msuser.model.UserModel;
import com.asi2.msstore.model.StoreAction;
import com.asi2.msstore.model.StoreTransaction;

@Service
public class StoreService {

	private final CardModelService cardService;
	private final UserService userService;
	private final StoreRepository storeRepository;

	public StoreService(CardModelService cardService, UserService userService, StoreRepository storeRepository) {
		this.cardService = cardService;
		this.userService = userService;
		this.storeRepository = storeRepository;
	}

	public boolean buyCard(Integer user_id, Integer card_id) {
		Optional<UserModel> u_option = userService.getUser(user_id);
		Optional<CardModel> c_option = cardService.getCard(card_id);
		if (!u_option.isPresent() || !c_option.isPresent()) {
			return false;
		}
		UserModel u = u_option.get();
		CardModel c = c_option.get();
		if (u.getAccount() > c.getPrice()) {
			u.addCard(c);
			u.setAccount(u.getAccount() - c.getPrice());
			userService.updateUser(u);
			StoreTransaction sT = new StoreTransaction(user_id, card_id, StoreAction.BUY);
			storeRepository.save(sT);
			return true;
		} else {
			return false;
		}
	}

	public boolean sellCard(Integer user_id, Integer card_id) {
		Optional<UserModel> u_option = userService.getUser(user_id);
		Optional<CardModel> c_option = cardService.getCard(card_id);
		if (!u_option.isPresent() || !c_option.isPresent()) {
			return false;
		}
		UserModel u = u_option.get();
		CardModel c = c_option.get();

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
