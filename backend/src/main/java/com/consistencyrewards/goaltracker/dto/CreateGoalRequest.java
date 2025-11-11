package com.consistencyrewards.goaltracker.dto;

import lombok.Data;

@Data
public class CreateGoalRequest {
    private String title;
    private String description;
}