package com.consistencyrewards.goaltracker.service;

import com.consistencyrewards.goaltracker.model.Goal;
import com.consistencyrewards.goaltracker.model.User;
import com.consistencyrewards.goaltracker.model.WishlistItem;
import com.consistencyrewards.goaltracker.repository.GoalRepository;
import com.consistencyrewards.goaltracker.repository.UserRepository;
import com.consistencyrewards.goaltracker.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RewardsService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private UserRepository userRepository;

    // Check and update rewards for a user
    public void checkAndUpdateRewards(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get all goals for user
        List<Goal> goals = goalRepository.findByUser(user);

        // Check if user has any goal with 10+ day streak
        boolean hasConsistencyReward = goals.stream()
                .anyMatch(goal -> goal.getCurrentStreak() >= 10);

        // If user has earned consistency rewards, unlock consistency wishlist items
        if (hasConsistencyReward) {
            unlockConsistencyRewards(user);
        }

        // TODO: Check for completion rewards when we implement goal completion
    }

    private void unlockConsistencyRewards(User user) {
        // Find all consistency reward items that are not earned yet
        List<WishlistItem> items = wishlistItemRepository.findByUser(user);

        for (WishlistItem item : items) {
            if (item.getRewardType() == WishlistItem.RewardType.CONSISTENCY && !item.getIsEarned()) {
                item.setIsEarned(true);
                item.setEarnedAt(LocalDateTime.now());
                wishlistItemRepository.save(item);
                System.out.println("Unlocked consistency reward: " + item.getItemName());
            }
        }
    }
}