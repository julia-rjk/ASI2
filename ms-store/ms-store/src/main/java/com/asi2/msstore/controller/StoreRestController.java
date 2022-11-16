package com.asi2.msstore.controller;

import com.asi2.msstorepublic.model.StoreOrder;
import com.asi2.msstore.model.StoreTransaction;

import java.util.List;

import io.swagger.annotations.ApiOperation;
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

	@ApiOperation(value = "", nickname = "buy")
	@RequestMapping(method = RequestMethod.POST, value = "/buy")
	private boolean buy(@RequestBody StoreOrder order) {
		return storeService.buyCard(order.getUser_id(), order.getCard_id());
	}

	@ApiOperation(value = "", nickname = "sell")
	@RequestMapping(method = RequestMethod.POST, value = "/sell")
	private boolean sell(@RequestBody StoreOrder order) {
		return storeService.sellCard(order.getUser_id(), order.getCard_id());
	}

	@ApiOperation(value = "", nickname = "getAllTransactions")
	@RequestMapping(method = RequestMethod.GET, value = "")
	private List<StoreTransaction> getAllTransactions() {
		return storeService.getAllTransactions();
	}
}