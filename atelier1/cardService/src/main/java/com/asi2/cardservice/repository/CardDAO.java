package com.asi2.cardservice.repository;

import com.asi2.cardservice.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardDAO extends JpaRepository<Card, Long> {
    List<Card> findAll();
}
