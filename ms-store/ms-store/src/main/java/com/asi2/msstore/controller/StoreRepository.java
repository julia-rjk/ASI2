package com.asi2.msstore.controller;

import org.springframework.data.repository.CrudRepository;

import com.asi2.msstore.model.StoreTransaction;

public interface StoreRepository extends CrudRepository<StoreTransaction, Integer> {
	

}
