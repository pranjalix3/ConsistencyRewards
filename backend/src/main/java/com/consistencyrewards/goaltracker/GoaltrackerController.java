package com.consistencyrewards.goaltracker;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GoaltrackerController {
    @GetMapping("/test")
    public String test() {
        return "Hello from Backend!";
    }
}
