package com.asi2.mscard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.asi2.mscard.model.Card;

import java.util.List;

@Repository
public interface CardDAO extends JpaRepository<Card, Long> {
    List<Card> findAll();
}
