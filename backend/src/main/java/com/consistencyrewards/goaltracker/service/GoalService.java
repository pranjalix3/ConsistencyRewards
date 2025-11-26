package com.consistencyrewards.goaltracker.service;

import com.consistencyrewards.goaltracker.dto.CreateGoalRequest;
import com.consistencyrewards.goaltracker.dto.GoalResponse;
import com.consistencyrewards.goaltracker.model.Goal;
import com.consistencyrewards.goaltracker.model.User;
import com.consistencyrewards.goaltracker.repository.GoalRepository;
import com.consistencyrewards.goaltracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new goal
    public GoalResponse createGoal(String userEmail, CreateGoalRequest request) {
        // Set current month and year
        LocalDateTime now = LocalDateTime.now();
        String currentMonthYear = now.getMonth().toString() + " " + now.getYear();

        // Find user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create new goal
        Goal goal = new Goal();
        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setUser(user);
        goal.setIsActive(true);
        goal.setCurrentStreak(0);
        goal.setLongestStreak(0);
        goal.setMonthYear(currentMonthYear);
        goal.setIsArchived(false);

        // Save goal
        Goal savedGoal = goalRepository.save(goal);

        // Return response
        return mapToResponse(savedGoal);
    }

    // Get all goals for a user
    public List<GoalResponse> getUserGoals(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Goal> goals = goalRepository.findByUserAndIsArchived(user, false);

        return goals.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get a single goal by ID
    public GoalResponse getGoalById(Long goalId, String userEmail) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Check if goal belongs to the user
        if (!goal.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to goal");
        }

        return mapToResponse(goal);
    }

    // Delete a goal
    public void deleteGoal(Long goalId, String userEmail) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Check if goal belongs to the user
        if (!goal.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to goal");
        }

        goalRepository.delete(goal);
    }

    // Helper method to convert Goal to GoalResponse
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