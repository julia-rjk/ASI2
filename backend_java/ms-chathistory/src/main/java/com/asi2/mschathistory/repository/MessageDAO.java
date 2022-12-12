package com.asi2.mschathistory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.asi2.mschathistory.model.entity.Message;

import java.util.List;

@Repository
public interface MessageDAO extends JpaRepository<Message, Long> {
    List<Message> findAll();
    List<Message> findByUserId(Integer userId);
    List<Message> findByRoom(String room);
    List<Message> findAllByRoomEquals(String room);
}
