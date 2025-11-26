package com.consistencyrewards.goaltracker.controller;

import com.consistencyrewards.goaltracker.dto.GoalResponse;
import com.consistencyrewards.goaltracker.model.Goal;
import com.consistencyrewards.goaltracker.service.ArchiveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/archive")
public class ArchiveController {

    @Autowired
    private ArchiveService archiveService;

    // Archive current month's goals (manual trigger for now)
    @PostMapping("/archive-current-month")
    public ResponseEntity<String> archiveCurrentMonth(
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            archiveService.archiveCurrentMonthGoals(userEmail);
            return ResponseEntity.ok("Goals archived successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all archived goals
    @GetMapping("/goals")
    public ResponseEntity<List<GoalResponse>> getArchivedGoals(
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            List<Goal> goals = archiveService.getArchivedGoals(userEmail);
            List<GoalResponse> response = goals.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Helper method
    private GoalResponse mapToResponse(Goal goal) {
        return new GoalResponse(
                goal.getId(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getIsActive(),
                goal.getCurrentStreak(),
                goal.getLongestStreak(),
                goal.getCreatedAt(),
                goal.getMonthYear(),
                goal.getIsArchived(),
                goal.getFinalStreak()
        );
    }
}