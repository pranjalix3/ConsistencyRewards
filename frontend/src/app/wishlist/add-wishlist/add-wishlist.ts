import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-wishlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-wishlist.html',
  styleUrl: './add-wishlist.css'
})
export class AddWishlist {
  itemName = '';
  description = '';
  price: number | null = null;
  rewardType: 'CONSISTENCY' | 'COMPLETION' | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.itemName.trim()) {
      this.errorMessage = 'Item name is required';
      return;
    }

    if (!this.price || this.price <= 0) {
      this.errorMessage = 'Price must be greater than 0';
      return;
    }

    if (!this.rewardType) {
      this.errorMessage = 'Please select a reward type';
      return;
    }

    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      this.errorMessage = 'Please login first';
      this.router.navigate(['/login']);
      return;
    }

    const wishlistRequest = {
      itemName: this.itemName,
      description: this.description,
      price: this.price,
      rewardType: this.rewardType
    };

    this.http.post<any>('http://localhost:8080/api/wishlist', wishlistRequest, {
      headers: {
        'X-User-Email': userEmail
      }
    }).subscribe({
      next: (response) => {
        console.log('Wishlist item added!', response);
        this.successMessage = 'Item added to wishlist! Redirecting...';
        
        setTimeout(() => {
          this.router.navigate(['/wishlist']);
        }, 1500);
      },
      error: (error) => {
        console.error('Failed to add wishlist item', error);
        this.errorMessage = 'Failed to add item. Please try again.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}