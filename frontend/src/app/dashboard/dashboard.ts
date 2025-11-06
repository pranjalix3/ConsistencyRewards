import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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

    // TODO: These will be fetched from backend later
    this.totalGoals = 0;
    this.currentStreak = 0;
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
    // TODO: Navigate to create goal page (Phase 3)
    alert('Create Goal feature coming in Phase 3!');
  }
}