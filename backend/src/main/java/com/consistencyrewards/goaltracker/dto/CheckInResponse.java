package com.consistencyrewards.goaltracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class CheckInResponse {
    private Long id;
    private Long goalId;
    private LocalDate checkInDate;
    private Boolean celebrateConsistency; // Did user just unlock consistency rewards?
    private List<WishlistItemResponse> newlyEarnedRewards; // List of newly earned rewards
}