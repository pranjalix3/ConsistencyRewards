import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import confetti from 'canvas-confetti';
import { CelebrationPopup } from '../../shared/celebration-popup/celebration-popup';

interface Goal {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

interface CheckIn {
  id: number;
  goalId: number;
  checkInDate: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isCheckedIn: boolean;
  isToday: boolean;
}

interface CheckIn {
  id: number;
  goalId: number;
  checkInDate: string;
  celebrateConsistency?: boolean;
  newlyEarnedRewards?: WishlistItem[];
}

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
  selector: 'app-goal-details',
  imports: [CommonModule, CelebrationPopup],
  templateUrl: './goal-details.html',
  styleUrl: './goal-details.css'
})
export class GoalDetails implements OnInit {
  goal: Goal | null = null;
  loading = true;
  goalId: number = 0;
  
  // Calendar
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  currentMonthName = '';
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  
  // Check-ins
  checkIns: CheckIn[] = [];
  hasCheckedInToday = false;
  totalCheckIns = 0;

  // Celebration
  showCelebration = false;
  celebrationMessage = '';
  earnedRewards: WishlistItem[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get goal ID from route
    this.route.params.subscribe(params => {
      this.goalId = +params['id'];
      this.loadGoalDetails();
      this.loadCheckIns();
    });
  }

  loadGoalDetails() {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<Goal>(`http://localhost:8080/api/goals/${this.goalId}`, {
      headers: { 'X-User-Email': userEmail }
    }).subscribe({
      next: (response) => {
        this.goal = response;
        this.loading = false;
        console.log('Goal loaded:', this.goal);
      },
      error: (error) => {
        console.error('Failed to load goal', error);
        this.loading = false;
        alert('Failed to load goal');
        this.router.navigate(['/goals']);
      }
    });
  }

  loadCheckIns() {
    const userEmail = localStorage.getItem('email');
    
    this.http.get<CheckIn[]>(
      `http://localhost:8080/api/checkins/goal/${this.goalId}/month/${this.currentYear}/${this.currentMonth + 1}`,
      { headers: { 'X-User-Email': userEmail! } }
    ).subscribe({
      next: (response) => {
        this.checkIns = response;
        this.totalCheckIns = response.length;
        this.checkTodayStatus();
        this.generateCalendar();
        console.log('Check-ins loaded:', this.checkIns);
      },
      error: (error) => {
        console.error('Failed to load check-ins', error);
      }
    });
  }

  checkTodayStatus() {
    const today = new Date().toISOString().split('T')[0];
    this.hasCheckedInToday = this.checkIns.some(
      checkIn => checkIn.checkInDate === today
    );
  }

  generateCalendar() {
    this.calendarDays = [];
    
    // Get month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    this.currentMonthName = monthNames[this.currentMonth];

    // First day of month
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startingDayOfWeek = firstDay.getDay();

    // Last day of month
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month's days
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      this.calendarDays.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isCheckedIn: false,
        isToday: false
      });
    }

    // Current month's days
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isCheckedIn = this.checkIns.some(checkIn => checkIn.checkInDate === dateStr);
      const isToday = day === todayDate && 
                     this.currentMonth === todayMonth && 
                     this.currentYear === todayYear;

      this.calendarDays.push({
        date: day,
        isCurrentMonth: true,
        isCheckedIn: isCheckedIn,
        isToday: isToday
      });
    }

    // Next month's days
    const remainingDays = 42 - this.calendarDays.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push({
        date: day,
        isCurrentMonth: false,
        isCheckedIn: false,
        isToday: false
      });
    }
  }

  onCheckIn() {
  if (this.hasCheckedInToday) {
    return;
  }

  const userEmail = localStorage.getItem('email');
  const today = new Date().toISOString().split('T')[0];

  const checkInRequest = {
    goalId: this.goalId,
    checkInDate: today
  };

  this.http.post<CheckIn>('http://localhost:8080/api/checkins', checkInRequest, {
    headers: { 'X-User-Email': userEmail! }
  }).subscribe({
    next: (response) => {
      console.log('Checked in successfully!', response);
      this.hasCheckedInToday = true;
      
      // Check if celebration should trigger
      if (response.celebrateConsistency && response.newlyEarnedRewards && response.newlyEarnedRewards.length > 0) {
        // Filter out already claimed rewards
        this.earnedRewards = response.newlyEarnedRewards.filter(r => !r.isClaimed);
        
        if (this.earnedRewards.length > 0) {
          // Trigger confetti
          this.triggerConfetti();
          
          // Show celebration popup
          this.celebrationMessage = '🎉 You unlocked Consistency Rewards!';
          this.showCelebration = true;
        }
      }
      
      this.loadGoalDetails(); // Reload to get updated streaks
      this.loadCheckIns(); // Reload check-ins to update calendar
    },
    error: (error) => {
      console.error('Check-in failed', error);
      alert('Failed to check in. Please try again.');
    }
  });
}

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadCheckIns();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadCheckIns();
  }

  onDeleteGoal() {
    if (!confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      return;
    }

    const userEmail = localStorage.getItem('email');

    this.http.delete(`http://localhost:8080/api/goals/${this.goalId}`, {
      headers: { 'X-User-Email': userEmail! }
    }).subscribe({
      next: () => {
        console.log('Goal deleted');
        this.router.navigate(['/goals']);
      },
      error: (error) => {
        console.error('Failed to delete goal', error);
        alert('Failed to delete goal');
      }
    });
  }

  goBack() {
    this.router.navigate(['/goals']);
  }

  triggerConfetti() {
  // Confetti burst
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#f093fb', '#f5576c', '#667eea', '#764ba2']
    });
    
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#f093fb', '#f5576c', '#667eea', '#764ba2']
    });
  }, 50);
}

onCelebrationClose() {
  this.showCelebration = false;
  this.earnedRewards = [];
}

onRewardClaimed() {
  // Refresh goal details and wishlist
  this.loadGoalDetails();
}
}