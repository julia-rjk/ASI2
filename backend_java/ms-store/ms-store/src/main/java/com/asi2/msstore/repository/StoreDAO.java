package com.asi2.msstore.repository;

import com.asi2.msstore.model.entity.StoreTransaction;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreDAO extends CrudRepository<StoreTransaction, Integer> {

}
