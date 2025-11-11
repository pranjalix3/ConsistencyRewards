package com.consistencyrewards.goaltracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class CheckInResponse {
    private Long id;
    private Long goalId;
    private LocalDate checkInDate;
}