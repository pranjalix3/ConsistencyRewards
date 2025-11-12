package com.consistencyrewards.goaltracker.controller;

import com.consistencyrewards.goaltracker.dto.CreateWishlistItemRequest;
import com.consistencyrewards.goaltracker.dto.WishlistItemResponse;
import com.consistencyrewards.goaltracker.service.RewardsService;
import com.consistencyrewards.goaltracker.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private RewardsService rewardsService;

    // Create a new wishlist item
    @PostMapping
    public ResponseEntity<WishlistItemResponse> createWishlistItem(
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody CreateWishlistItemRequest request) {
        try {
            WishlistItemResponse response = wishlistService.createWishlistItem(userEmail, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all wishlist items for user
    @GetMapping
    public ResponseEntity<List<WishlistItemResponse>> getUserWishlistItems(
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            List<WishlistItemResponse> items = wishlistService.getUserWishlistItems(userEmail);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get specific wishlist item
    @GetMapping("/{id}")
    public ResponseEntity<WishlistItemResponse> getWishlistItem(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            WishlistItemResponse item = wishlistService.getWishlistItemById(id, userEmail);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Claim a wishlist item
    @PostMapping("/{id}/claim")
    public ResponseEntity<WishlistItemResponse> claimItem(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            WishlistItemResponse response = wishlistService.claimItem(id, userEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete a wishlist item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWishlistItem(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            wishlistService.deleteWishlistItem(id, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Check and update rewards
    @PostMapping("/check-rewards")
    public ResponseEntity<String> checkRewards(
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            rewardsService.checkAndUpdateRewards(userEmail);
            return ResponseEntity.ok("Rewards checked and updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}