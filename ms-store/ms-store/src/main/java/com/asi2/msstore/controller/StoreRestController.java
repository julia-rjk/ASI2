package com.asi2.msstore.controller;

import com.asi2.msstorepublic.model.StoreOrder;
import com.asi2.msstore.model.StoreTransaction;

import java.util.List;

import org.springframework.web.bind.annotation.*;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController
@RequestMapping(value="/api/store")
public class StoreRestController {

	private final StoreService storeService;

	public StoreRestController(StoreService storeService) {
		this.storeService = storeService;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/buy")
	private boolean getAllCards(@RequestBody StoreOrder order) {
		return storeService.buyCard(order.getUser_id(), order.getCard_id());

	}

	@RequestMapping(method = RequestMethod.POST, value = "/sell")
	private boolean getCard(@RequestBody StoreOrder order) {
		return storeService.sellCard(order.getUser_id(), order.getCard_id());
	}

	@RequestMapping(method = RequestMethod.GET, value = "")
	private List<StoreTransaction> getCard() {
		return storeService.getAllTransactions();
	}
}