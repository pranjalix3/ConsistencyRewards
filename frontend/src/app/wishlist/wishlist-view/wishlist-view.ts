import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface WishlistItem {
  id: number;
  itemName: string;
  description: string;
  price: number;
  rewardType: 'CONSISTENCY' | 'COMPLETION';
  isEarned: boolean;
  isClaimed: boolean;
  earnedAt: string | null;
  claimedAt: string | null;
  createdAt: string;
}

@Component({
  selector: 'app-wishlist-view',
  imports: [CommonModule],
  templateUrl: './wishlist-view.html',
  styleUrl: './wishlist-view.css'
})
export class WishlistView implements OnInit {
  wishlistItems: WishlistItem[] = [];
  loading = true;
  totalItems = 0;
  earnedItems = 0;
  claimedItems = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<WishlistItem[]>('http://localhost:8080/api/wishlist', {
      headers: { 'X-User-Email': userEmail }
    }).subscribe({
      next: (response) => {
        this.wishlistItems = response;
        this.loading = false;
        
        // Calculate stats
        this.totalItems = response.length;
        this.earnedItems = response.filter(item => item.isEarned).length;
        this.claimedItems = response.filter(item => item.isClaimed).length;
        
        console.log('Wishlist loaded:', this.wishlistItems);
      },
      error: (error) => {
        console.error('Failed to load wishlist', error);
        this.loading = false;
      }
    });
  }

  onAddItem() {
    this.router.navigate(['/wishlist/add']);
  }

  onClaimItem(itemId: number) {
    if (!confirm('Are you sure you want to claim this reward?')) {
      return;
    }

    const userEmail = localStorage.getItem('email');

    this.http.post(`http://localhost:8080/api/wishlist/${itemId}/claim`, {}, {
      headers: { 'X-User-Email': userEmail! }
    }).subscribe({
      next: () => {
        console.log('Item claimed successfully!');
        this.loadWishlist(); // Reload the list
      },
      error: (error) => {
        console.error('Failed to claim item', error);
        alert('Failed to claim item. Make sure it has been earned!');
      }
    });
  }

  onDeleteItem(itemId: number) {
    if (!confirm('Are you sure you want to delete this item from your wishlist?')) {
      return;
    }

    const userEmail = localStorage.getItem('email');

    this.http.delete(`http://localhost:8080/api/wishlist/${itemId}`, {
      headers: { 'X-User-Email': userEmail! }
    }).subscribe({
      next: () => {
        console.log('Item deleted');
        this.loadWishlist(); // Reload the list
      },
      error: (error) => {
        console.error('Failed to delete item', error);
        alert('Failed to delete item');
      }
    });
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}