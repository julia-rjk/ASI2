package com.asi2.mslogesb.controller;

import com.asi2.mslogesb.constant.Router;
import com.asi2.mslogesb.service.LogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping(Router.URL_LOG)
public class LogEsbController {
    @Autowired
    private LogService logService;

    @PutMapping()
    public Boolean ajouterLog(@RequestBody @Validated String customMessage) {
        try {
            logService.saveToFile(customMessage);
            return Boolean.TRUE;
        } catch (Exception e) {
            log.error("An error occured while saving the message : {}", e.getMessage());
        }

        return Boolean.FALSE;
    }
}
