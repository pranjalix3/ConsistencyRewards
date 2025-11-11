package com.consistencyrewards.goaltracker.service;

import com.consistencyrewards.goaltracker.dto.CheckInRequest;
import com.consistencyrewards.goaltracker.dto.CheckInResponse;
import com.consistencyrewards.goaltracker.model.CheckIn;
import com.consistencyrewards.goaltracker.model.Goal;
import com.consistencyrewards.goaltracker.repository.CheckInRepository;
import com.consistencyrewards.goaltracker.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CheckInService {

    @Autowired
    private CheckInRepository checkInRepository;

    @Autowired
    private GoalRepository goalRepository;

    // Create a check-in
    public CheckInResponse createCheckIn(CheckInRequest request, String userEmail) {
        // Find the goal
        Goal goal = goalRepository.findById(request.getGoalId())
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Verify goal belongs to user
        if (!goal.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to goal");
        }

        // Check if already checked in for this date
        Optional<CheckIn> existing = checkInRepository.findByGoalAndCheckInDate(
                goal, request.getCheckInDate());

        if (existing.isPresent()) {
            throw new RuntimeException("Already checked in for this date");
        }

        // Create check-in
        CheckIn checkIn = new CheckIn();
        checkIn.setGoal(goal);
        checkIn.setCheckInDate(request.getCheckInDate());

        CheckIn saved = checkInRepository.save(checkIn);

        // Update goal streaks
        updateGoalStreaks(goal);

        return new CheckInResponse(saved.getId(), saved.getGoal().getId(), saved.getCheckInDate());
    }

    // Get check-ins for a goal in a specific month
    public List<CheckInResponse> getMonthCheckIns(Long goalId, int year, int month, String userEmail) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        // Verify goal belongs to user
        if (!goal.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to goal");
        }

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        List<CheckIn> checkIns = checkInRepository.findByGoalAndCheckInDateBetween(
                goal, startDate, endDate);

        return checkIns.stream()
                .map(c -> new CheckInResponse(c.getId(), c.getGoal().getId(), c.getCheckInDate()))
                .collect(Collectors.toList());
    }

    // Calculate and update goal streaks
    private void updateGoalStreaks(Goal goal) {
        List<CheckIn> allCheckIns = checkInRepository.findByGoal(goal);

        if (allCheckIns.isEmpty()) {
            goal.setCurrentStreak(0);
            goal.setLongestStreak(0);
            goalRepository.save(goal);
            return;
        }

        // Sort check-ins by date (oldest first)
        List<LocalDate> dates = allCheckIns.stream()
                .map(CheckIn::getCheckInDate)
                .sorted()
                .collect(Collectors.toList());

        // Calculate current streak (counting backwards from today)
        int currentStreak = 0;
        LocalDate checkDate = LocalDate.now();

        for (int i = dates.size() - 1; i >= 0; i--) {
            if (dates.get(i).equals(checkDate)) {
                currentStreak++;
                checkDate = checkDate.minusDays(1);
            } else if (dates.get(i).isBefore(checkDate)) {
                break;
            }
        }

        // Calculate longest streak
        int longestStreak = 0;
        int tempStreak = 1;

        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i).equals(dates.get(i - 1).plusDays(1))) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 1;
            }
        }

        longestStreak = Math.max(longestStreak, tempStreak);
        longestStreak = Math.max(longestStreak, currentStreak);

        // Update goal
        goal.setCurrentStreak(currentStreak);
        goal.setLongestStreak(longestStreak);
        goalRepository.save(goal);
    }
}