import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Goal {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  fullName = '';
  currentMonth = '';
  currentDate = '';
  nextMonth = '';
  daysLeftInMonth = 0;
  monthlyQuote = '';
  totalGoals = 0;
  currentStreak = 0;
  totalWishlistItems = 0;

  // Monthly quotes
  private monthlyQuotes: { [key: string]: string } = {
    'January': 'New year, new beginnings. Make every day count!',
    'February': 'Love yourself enough to pursue your dreams consistently.',
    'March': 'Spring forward with determination and watch yourself bloom.',
    'April': 'April showers bring May flowers. Stay consistent through the challenges.',
    'May': 'May your efforts today create the success of tomorrow.',
    'June': 'Summer vibes and consistent strides - keep the momentum going!',
    'July': 'Independence comes from daily discipline. Stay the course.',
    'August': 'The final push of summer - finish strong!',
    'September': 'Fall into good habits. Let consistency be your foundation.',
    'October': 'Harvest the results of your consistent efforts.',
    'November': 'Gratitude and grit - be thankful and stay committed.',
    'December': 'End the year strong. Your future self will thank you.'
  };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Get user info from localStorage
    this.fullName = localStorage.getItem('fullName') || 'User';

    // Set current month and date
    const now = new Date();
    this.currentMonth = now.toLocaleString('default', { month: 'long' });
    this.currentDate = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });

    // Calculate days left in month
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.daysLeftInMonth = lastDay.getDate() - now.getDate();

    // Get next month
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    this.nextMonth = nextMonthDate.toLocaleString('default', { month: 'long' });

    // Set monthly quote
    this.monthlyQuote = this.monthlyQuotes[this.currentMonth];

    // Fetch real stats from backend
    this.loadStats();
  }

  loadStats() {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      return;
    }

    // Fetch goals
    this.http.get<Goal[]>('http://localhost:8080/api/goals', {
      headers: { 'X-User-Email': userEmail }
    }).subscribe({
      next: (goals) => {
        this.totalGoals = goals.length;
        
        // Calculate highest current streak among all goals
        if (goals.length > 0) {
          this.currentStreak = Math.max(...goals.map(g => g.currentStreak));
        } else {
          this.currentStreak = 0;
        }
        
        console.log('Dashboard stats loaded:', {
          totalGoals: this.totalGoals,
          currentStreak: this.currentStreak
        });
      },
      error: (error) => {
        console.error('Failed to load stats', error);
      }
    });

    // TODO: Fetch wishlist items count when wishlist is implemented
    this.totalWishlistItems = 0;
  }

  onLogout() {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');

    // Redirect to login
    this.router.navigate(['/login']);
  }

  onCreateGoal() {
    this.router.navigate(['/goals/create']);
  }

  onAddWishlist() {
    // TODO: Navigate to add wishlist page (Phase 3)
    alert('Add to Wishlist feature coming in Phase 3!');
  }

  onGoToGoals() {
    this.router.navigate(['/goals']);
  }
}