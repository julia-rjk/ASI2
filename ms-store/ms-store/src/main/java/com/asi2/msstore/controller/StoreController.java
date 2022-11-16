package com.asi2.msstore.controller;

import com.asi2.msstore.model.entity.StoreTransaction;
import com.asi2.msstore.service.store.StoreService;
import com.asi2.msstorepublic.model.StoreOrder;
import lombok.extern.slf4j.Slf4j;
import model.action.ActionBasic;
import model.action.ActionStore;
import model.message.CustomMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import service.SenderService;

import java.util.Date;
import java.util.List;
import java.util.Random;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@Slf4j
@RestController
@RequestMapping(value="/api/store")
public class StoreController {

	private final StoreService storeService;

	@Autowired
	private SenderService<StoreOrder, ActionStore> senderService;

	public StoreController(StoreService storeService, SenderService<StoreOrder, ActionStore> senderService) {
		this.storeService = storeService;
		this.senderService = senderService;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/buy")
	private Boolean buyCardAsync(@RequestBody StoreOrder order) {
		try {
			senderService.sendMessage(new CustomMessage<>(
					new Random().nextLong(),
					ActionStore.BUY,
					ServletUriComponentsBuilder.fromCurrentContextPath().toUriString(),
					String.valueOf(new Date()),
					order
			));
			return Boolean.TRUE;

		} catch (Exception e) {
			log.error("Error when creating the message for the queue : {}", e.getMessage());
		}

		return Boolean.FALSE;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/sell")
	private Boolean sellCardAsync(@RequestBody StoreOrder order) {
		try {
			senderService.sendMessage(new CustomMessage<>(
					new Random().nextLong(),
					ActionStore.SELL,
					ServletUriComponentsBuilder.fromCurrentContextPath().toUriString(),
					String.valueOf(new Date()),
					order
			));
			return Boolean.TRUE;

		} catch (Exception e) {
			log.error("Error when creating the message for the queue : {}", e.getMessage());
		}

		return Boolean.FALSE;
	}

	@RequestMapping(method = RequestMethod.GET, value = "")
	private List<StoreTransaction> getCard() {
		return storeService.getAllTransactions();
	}
}