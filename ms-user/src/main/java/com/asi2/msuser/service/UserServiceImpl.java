package com.asi2.msuser.service;

import com.asi2.msuser.constant.Game;
import com.asi2.msuser.model.User;
import com.asi2.msuser.repository.UserDAO;
import com.asi2.msuser.utils.GlobalProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import model.dto.CardDTO;
import model.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utils.Mapper;
import utils.WebService;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private GlobalProperty globalProperty;

    @Override
    public List<UserDTO> findAll() {
        try {
            return Mapper.mapList(userDAO.findAll(), UserDTO.class);
        } catch (Exception e) {
            log.error("Error when finding all Users : {}", e.getMessage());
            return null;
        }
    }

    @Override
    public UserDTO findById(Long id) {
        try {
            if (userDAO.findById(id).isPresent()) {
                User user = userDAO.findById(id).get();
                UserDTO userDTO = Mapper.map(user, UserDTO.class);
                userDTO.setCards(getAllCardsOfUser(user));
                return userDTO;
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
            User user = userDAO.findByLoginAndPassword(login, password);
            if (user != null) {
                // TODO Generate Token from Auth Service

                UserDTO userDTO = Mapper.map(user, UserDTO.class);
                userDTO.setCards(getAllCardsOfUser(user));
                return userDTO;
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
        User user = Mapper.map(userDto, User.class);
        try {
            // Needed to have an id
            if (save(user)) {
                // Set up the default deck of the user
                String response;
                ObjectMapper mapper = new ObjectMapper();
                List<Long> userIdCards = new ArrayList<>();
                for (int i = 0; i < Game.MINIMUM_CARD; i++) {
                    // Call Card Service to set up default card for the user
                    response = WebService.post(globalProperty.getUrlCard() + "?id=" + user.getId(), user);

                    // Mapping from JSON to DTO
                    if (response != null) {
                        CardDTO card = mapper.readValue(response, CardDTO.class);
                        userIdCards.add(card.getId());
                    } else {
                        log.error("An error occured with the Card Service or the service is not available");
                        userDAO.delete(user);
                        return Boolean.FALSE;
                    }
                }

                // Set all id of cards to user
                user.setAccount(Game.BASE_ACCOUNT);
                user.setIdCardList(userIdCards);

                if (save(user)) {
                    userDto.setId(user.getId());
                    return Boolean.TRUE;
                }
            } else {
                log.error("An error occured during the creation of the user");
                userDAO.delete(user);
            }
        } catch (JsonMappingException e) {
            userDAO.delete(user);
            log.error("Error when mapping the card for user: {} ", e.getMessage());
        } catch (Exception e) {
            userDAO.delete(user);
            log.error("Error when register the user : {} ", e.getMessage());
        }

        return Boolean.FALSE;
    }

    @Override
    public Boolean delete(Long id){
        if(userDAO.findById(id).isPresent()) {
            userDAO.delete(userDAO.findById(id).get());
            return Boolean.TRUE;
        } else {
            log.info("The user id[{}] does not exist", id);
            return Boolean.FALSE;
        }
    }

    @Override
    public UserDTO update(Long id, UserDTO userDTO) {
        if(userDAO.findById(id).isPresent()) {
            User user = userDAO.findById(id).get();

            // Mapping
            user.setAccount(userDTO.getAccount());
            user.setEmail(userDTO.getEmail());
            user.setLastName(userDTO.getLastName());
            user.setLogin(userDTO.getLogin());
            user.setPassword(userDTO.getPassword());
            user.setSurName(userDTO.getSurName());
            userDTO.setId(user.getId());
            if(userDTO.getCards() != null && userDTO.getCards().size() != 0) {
                List<Long> idCards = new ArrayList<>();
                for(CardDTO cardDTO : userDTO.getCards()) {
                    idCards.add(cardDTO.getId());
                }
                user.setIdCardList(idCards);
            }
            else{
                user.setIdCardList(null);
            }

            save(user);
        } else {
            log.info("The user does not exist");
        }

        return userDTO;
    }

    private Boolean save(User user) {
        try {
            userDAO.save(user);
            return Boolean.TRUE;
        } catch (Exception e) {
            log.error("Error when saving entity to database : {}", e.getMessage());
            return Boolean.FALSE;
        }
    }

    private List<CardDTO> getAllCardsOfUser(User user) {
        ObjectMapper mapper = new ObjectMapper();
        List<CardDTO> cards = new ArrayList<>();
        for (int i = 0; i < user.getIdCardList().size(); i++) {
            // Call Card Service to set up default card for the user
            String response = WebService.get(globalProperty.getUrlCard() + "/" + user.getIdCardList().get(i));

            // Mapping the response
            try {
                if (response != null) {
                    cards.add(mapper.readValue(response, CardDTO.class));
                } else {
                    log.error("An error occured with the Card Service or the service is not available");
                }

            } catch (JsonProcessingException e) {
                log.error("Error when mapping the card for user: {} ", e.getMessage());
            }
        }
        return cards;
    }
}
