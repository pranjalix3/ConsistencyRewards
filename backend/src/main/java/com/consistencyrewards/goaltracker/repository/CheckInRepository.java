package com.consistencyrewards.goaltracker.repository;

import com.consistencyrewards.goaltracker.model.CheckIn;
import com.consistencyrewards.goaltracker.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {

    // Find all check-ins for a specific goal
    List<CheckIn> findByGoal(Goal goal);

    // Find check-ins for a goal in a specific month
    List<CheckIn> findByGoalAndCheckInDateBetween(Goal goal, LocalDate startDate, LocalDate endDate);

    // Check if user already checked in today for this goal
    Optional<CheckIn> findByGoalAndCheckInDate(Goal goal, LocalDate date);

    // Count total check-ins for a goal
    Long countByGoal(Goal goal);
}