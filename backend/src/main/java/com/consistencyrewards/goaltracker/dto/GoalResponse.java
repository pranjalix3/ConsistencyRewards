package com.consistencyrewards.goaltracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class GoalResponse {
    private Long id;
    private String title;
    private String description;
    private Boolean isActive;
    private Integer currentStreak;
    private Integer longestStreak;
    private LocalDateTime createdAt;
}