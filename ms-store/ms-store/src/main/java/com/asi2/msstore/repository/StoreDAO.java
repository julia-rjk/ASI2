package com.asi2.msstore.repository;

import com.asi2.msstore.model.entity.StoreTransaction;
import org.springframework.data.repository.CrudRepository;

public interface StoreDAO extends CrudRepository<StoreTransaction, Integer> {

}
