package com.consistencyrewards.goaltracker.repository;

import com.consistencyrewards.goaltracker.model.User;
import com.consistencyrewards.goaltracker.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    // Find all wishlist items for a user
    List<WishlistItem> findByUser(User user);

    // Find earned but unclaimed items
    List<WishlistItem> findByUserAndIsEarnedAndIsClaimed(User user, Boolean isEarned, Boolean isClaimed);

    // Count total wishlist items for a user
    Long countByUser(User user);

    // Count earned items
    Long countByUserAndIsEarned(User user, Boolean isEarned);
}