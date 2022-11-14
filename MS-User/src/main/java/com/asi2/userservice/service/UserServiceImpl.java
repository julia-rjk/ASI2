package com.asi2.userservice.service;

import com.asi2.userservice.constant.Game;
import com.asi2.userservice.model.User;
import com.asi2.userservice.repository.UserDAO;
import com.asi2.userservice.utils.GlobalProperty;
import lombok.extern.slf4j.Slf4j;
import model.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utils.Mapper;
import utils.WebService;

import java.util.List;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDao;

    @Autowired
    private GlobalProperty globalProperty;

    @Override
    public List<UserDTO> findAll() {
        try {
            return Mapper.mapList(userDao.findAll(), UserDTO.class);
        } catch (Exception e) {
            log.error("Error when finding all Users : {}", e.getMessage());
            return null;
        }
    }

    @Override
    public UserDTO findById(Long id) {
        try {
            if (userDao.findById(id).isPresent()) {
                User user = userDao.findById(id).get();
                return Mapper.map(user, UserDTO.class);
            } else {
                log.info("The user[{}] doesn't exist", id);
            }
        } catch (Exception e) {
            log.error("Error when finding user[{}] : {} ", id, e.getMessage());
        }

        return null;
    }

    @Override
    public UserDTO login(String login, String password) {
        try {
            User user = userDao.findByLoginAndPassword(login, password);
            if (user != null) {
                // TODO Generate Token from Auth Service
                return Mapper.map(user, UserDTO.class);
            } else {
                log.info("The user does not exist");
            }
        } catch (Exception e) {
            log.error("Error when logging user : {} ", e.getMessage());
        }

        return null;
    }

    @Override
    public Boolean register(UserDTO userDto) {
        try {
            User user = Mapper.map(userDto, User.class);

            // Call Card Service to set up default card for the user
            String response = WebService.get(globalProperty.getUrlCard());

            save(user);
            return true;
        } catch (Exception e) {
            log.error("Error when saving in the database : {} ", e.getMessage());
            return Boolean.FALSE;
        }
    }

    @Override
    public void delete(UserDTO userDto) {
        // TODO When it'll be useful
    }

    @Override
    public void update(UserDTO userDto) {
        // TODO When it'll be useful
    }

    private void save(User user) {
        userDao.save(user);
    }
}
