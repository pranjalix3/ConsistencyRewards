package com.consistencyrewards.goaltracker.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CheckInRequest {
    private Long goalId;
    private LocalDate checkInDate;
}