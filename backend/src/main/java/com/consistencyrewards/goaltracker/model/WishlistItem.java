package com.consistencyrewards.goaltracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist_items")
@Data
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String itemName;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RewardType rewardType;

    @Column(nullable = false)
    private Boolean isEarned = false;

    @Column(nullable = false)
    private Boolean isClaimed = false;

    @Column(name = "earned_at")
    private LocalDateTime earnedAt;

    @Column(name = "claimed_at")
    private LocalDateTime claimedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum RewardType {
        CONSISTENCY,  // Small reward for 10-day streak
        COMPLETION    // Big reward for completing goal
    }
}