package com.consistencyrewards.goaltracker.controller;

import com.consistencyrewards.goaltracker.dto.CreateGoalRequest;
import com.consistencyrewards.goaltracker.dto.GoalResponse;
import com.consistencyrewards.goaltracker.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    // Create a new goal
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody CreateGoalRequest request) {
        try {
            GoalResponse response = goalService.createGoal(userEmail, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all goals for logged-in user
    @GetMapping
    public ResponseEntity<List<GoalResponse>> getUserGoals(
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            List<GoalResponse> goals = goalService.getUserGoals(userEmail);
            return ResponseEntity.ok(goals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get a specific goal by ID
    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getGoalById(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            GoalResponse goal = goalService.getGoalById(id, userEmail);
            return ResponseEntity.ok(goal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete a goal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            goalService.deleteGoal(id, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}