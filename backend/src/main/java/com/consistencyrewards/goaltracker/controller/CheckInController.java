package com.consistencyrewards.goaltracker.controller;

import com.consistencyrewards.goaltracker.dto.CheckInRequest;
import com.consistencyrewards.goaltracker.dto.CheckInResponse;
import com.consistencyrewards.goaltracker.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checkins")
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    // Create a check-in
    @PostMapping
    public ResponseEntity<CheckInResponse> createCheckIn(
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody CheckInRequest request) {
        try {
            CheckInResponse response = checkInService.createCheckIn(request, userEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get check-ins for a specific month
    @GetMapping("/goal/{goalId}/month/{year}/{month}")
    public ResponseEntity<List<CheckInResponse>> getMonthCheckIns(
            @PathVariable Long goalId,
            @PathVariable int year,
            @PathVariable int month,
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            List<CheckInResponse> checkIns = checkInService.getMonthCheckIns(
                    goalId, year, month, userEmail);
            return ResponseEntity.ok(checkIns);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}