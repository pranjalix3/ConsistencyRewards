package com.consistencyrewards.goaltracker.dto;

import com.consistencyrewards.goaltracker.model.WishlistItem;
import lombok.Data;

@Data
public class CreateWishlistItemRequest {
    private String itemName;
    private String description;
    private Double price;
    private WishlistItem.RewardType rewardType;
}