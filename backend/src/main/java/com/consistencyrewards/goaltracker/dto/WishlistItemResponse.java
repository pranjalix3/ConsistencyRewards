package com.consistencyrewards.goaltracker.dto;

import com.consistencyrewards.goaltracker.model.WishlistItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class WishlistItemResponse {
    private Long id;
    private String itemName;
    private String description;
    private Double price;
    private WishlistItem.RewardType rewardType;
    private Boolean isEarned;
    private Boolean isClaimed;
    private LocalDateTime earnedAt;
    private LocalDateTime claimedAt;
    private LocalDateTime createdAt;
}