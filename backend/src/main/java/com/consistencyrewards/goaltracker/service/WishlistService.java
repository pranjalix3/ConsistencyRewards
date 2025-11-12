package com.consistencyrewards.goaltracker.service;

import com.consistencyrewards.goaltracker.dto.CreateWishlistItemRequest;
import com.consistencyrewards.goaltracker.dto.WishlistItemResponse;
import com.consistencyrewards.goaltracker.model.User;
import com.consistencyrewards.goaltracker.model.WishlistItem;
import com.consistencyrewards.goaltracker.repository.UserRepository;
import com.consistencyrewards.goaltracker.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new wishlist item
    public WishlistItemResponse createWishlistItem(String userEmail, CreateWishlistItemRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WishlistItem item = new WishlistItem();
        item.setItemName(request.getItemName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setRewardType(request.getRewardType());
        item.setUser(user);
        item.setIsEarned(false);
        item.setIsClaimed(false);

        WishlistItem saved = wishlistItemRepository.save(item);
        return mapToResponse(saved);
    }

    // Get all wishlist items for a user
    public List<WishlistItemResponse> getUserWishlistItems(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WishlistItem> items = wishlistItemRepository.findByUser(user);
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get a specific wishlist item
    public WishlistItemResponse getWishlistItemById(Long itemId, String userEmail) {
        WishlistItem item = wishlistItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        // Verify item belongs to user
        if (!item.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to wishlist item");
        }

        return mapToResponse(item);
    }

    // Mark item as claimed
    public WishlistItemResponse claimItem(Long itemId, String userEmail) {
        WishlistItem item = wishlistItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        // Verify item belongs to user
        if (!item.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to wishlist item");
        }

        // Check if item is earned
        if (!item.getIsEarned()) {
            throw new RuntimeException("Item not earned yet");
        }

        // Check if already claimed
        if (item.getIsClaimed()) {
            throw new RuntimeException("Item already claimed");
        }

        item.setIsClaimed(true);
        item.setClaimedAt(LocalDateTime.now());

        WishlistItem saved = wishlistItemRepository.save(item);
        return mapToResponse(saved);
    }

    // Delete a wishlist item
    public void deleteWishlistItem(Long itemId, String userEmail) {
        WishlistItem item = wishlistItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        // Verify item belongs to user
        if (!item.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to wishlist item");
        }

        wishlistItemRepository.delete(item);
    }

    // Helper method to convert entity to DTO
    private WishlistItemResponse mapToResponse(WishlistItem item) {
        return new WishlistItemResponse(
                item.getId(),
                item.getItemName(),
                item.getDescription(),
                item.getPrice(),
                item.getRewardType(),
                item.getIsEarned(),
                item.getIsClaimed(),
                item.getEarnedAt(),
                item.getClaimedAt(),
                item.getCreatedAt()
        );
    }
}