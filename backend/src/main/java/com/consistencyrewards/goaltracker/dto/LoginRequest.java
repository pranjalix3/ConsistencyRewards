package com.consistencyrewards.goaltracker.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}