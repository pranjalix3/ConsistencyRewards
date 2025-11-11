package com.consistencyrewards.goaltracker.repository;

import com.consistencyrewards.goaltracker.model.Goal;
import com.consistencyrewards.goaltracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    // Find all goals for a specific user
    List<Goal> findByUser(User user);

    // Find active goals for a user
    List<Goal> findByUserAndIsActive(User user, Boolean isActive);

    // Count total goals for a user
    Long countByUser(User user);
}