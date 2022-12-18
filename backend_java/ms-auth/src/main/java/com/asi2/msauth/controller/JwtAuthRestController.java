package com.asi2.msauth.controller;

import com.asi2.msauth.constants.Router;
import com.asi2.msauth.model.dto.JwtRequest;
import com.asi2.msauth.model.dto.JwtResponse;
import com.asi2.msauth.service.AuthService;
import com.asi2.msauth.utils.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@CrossOrigin
public class JwtAuthRestController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtils;

    @Autowired
    private AuthService authService;

    @PostMapping(Router.AUTH)
    public ResponseEntity<?> createAuthentificationToken(@RequestBody JwtRequest authentificationRequest) throws Exception {
        authenticate(authentificationRequest.getUsername(), authentificationRequest.getPassword());
        final UserDetails userDetails = authService.loadUserByUsername(authentificationRequest.getUsername());
        final String token = jwtTokenUtils.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(token));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

}
