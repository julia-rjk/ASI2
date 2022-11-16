package com.asi2.msstore.service.store;

import com.asi2.msstore.model.entity.StoreTransaction;

import java.util.List;

public interface StoreService {

    boolean buyCard(Integer user_id, Integer card_id);

    boolean sellCard(Integer user_id, Integer card_id);

    List<StoreTransaction> getAllTransactions();
}
