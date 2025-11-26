package com.consistencyrewards.goaltracker.service;

import com.consistencyrewards.goaltracker.model.Goal;
import com.consistencyrewards.goaltracker.model.User;
import com.consistencyrewards.goaltracker.repository.GoalRepository;
import com.consistencyrewards.goaltracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArchiveService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    // Archive all active goals for a user (called at month end)
    public void archiveCurrentMonthGoals(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get all active goals
        List<Goal> activeGoals = goalRepository.findByUserAndIsArchived(user, false);

        for (Goal goal : activeGoals) {
            goal.setIsArchived(true);
            goal.setArchivedAt(LocalDateTime.now());
            goal.setFinalStreak(goal.getCurrentStreak());
            goalRepository.save(goal);
        }
    }

    // Get archived goals grouped by month
    public List<Goal> getArchivedGoals(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return goalRepository.findByUserAndIsArchivedOrderByArchivedAtDesc(user, true);
    }

    // Get archived goals for a specific month
    public List<Goal> getArchivedGoalsByMonth(String userEmail, String monthYear) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return goalRepository.findByUserAndIsArchivedAndMonthYear(user, true, monthYear);
    }
}