import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface WishlistItem {
  id: number;
  itemName: string;
  description: string;
  price: number;
  rewardType: 'CONSISTENCY' | 'COMPLETION';
  isEarned: boolean;
  isClaimed: boolean;
}

@Component({
  selector: 'app-celebration-popup',
  imports: [CommonModule],
  templateUrl: './celebration-popup.html',
  styleUrl: './celebration-popup.css'
})
export class CelebrationPopup {
  @Input() isVisible = false;
  @Input() message = 'You have unlocked new rewards!';
  @Input() rewards: WishlistItem[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() rewardClaimed = new EventEmitter<void>();

  claimingId: number | null = null;

  constructor(private http: HttpClient) {}

  onClose() {
    this.isVisible = false;
    this.close.emit();
  }

  onOverlayClick() {
    this.onClose();
  }

  onClaimReward(rewardId: number) {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) return;

    this.claimingId = rewardId;

    this.http.post(`http://localhost:8080/api/wishlist/${rewardId}/claim`, {}, {
      headers: { 'X-User-Email': userEmail }
    }).subscribe({
      next: () => {
        console.log('Reward claimed successfully!');
        // Remove claimed reward from the list
        this.rewards = this.rewards.filter(r => r.id !== rewardId);
        this.claimingId = null;
        this.rewardClaimed.emit();
        
        // Close popup if no more rewards
        if (this.rewards.length === 0) {
          setTimeout(() => this.onClose(), 1000);
        }
      },
      error: (error) => {
        console.error('Failed to claim reward', error);
        alert('Failed to claim reward. Please try again.');
        this.claimingId = null;
      }
    });
  }
}