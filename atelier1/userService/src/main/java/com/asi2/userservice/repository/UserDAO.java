package com.asi2.userservice.repository;

import com.asi2.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDAO extends JpaRepository<User, Long> {
    List<User> findAll();

    User findByLoginAndPassword(String login, String password);
}
