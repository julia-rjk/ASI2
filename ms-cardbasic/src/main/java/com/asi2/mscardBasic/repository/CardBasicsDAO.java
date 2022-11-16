package com.asi2.mscardBasic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.asi2.mscardBasic.model.CardBasics;

import java.util.List;

@Repository
public interface CardBasicsDAO extends JpaRepository<CardBasics, Long> {
    List<CardBasics> findAll();
}
