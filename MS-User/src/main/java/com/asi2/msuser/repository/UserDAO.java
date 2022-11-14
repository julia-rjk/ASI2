package com.asi2.msuser.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.asi2.msuser.model.User;

import java.util.List;

@Repository
public interface UserDAO extends JpaRepository<User, Long> {
    List<User> findAll();

    User findByLoginAndPassword(String login, String password);
}
