import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  selector: 'app-goals-list',
  imports: [CommonModule],
  templateUrl: './goals-list.html',
  styleUrl: './goals-list.css'
})
export class GoalsList implements OnInit {
  goals: Goal[] = [];
  loading = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<Goal[]>('http://localhost:8080/api/goals', {
      headers: {
        'X-User-Email': userEmail
      }
    }).subscribe({
      next: (response) => {
        this.goals = response;
        this.loading = false;
        console.log('Goals loaded:', this.goals);
      },
      error: (error) => {
        console.error('Failed to load goals', error);
        this.loading = false;
      }
    });
  }

  onCreateGoal() {
    this.router.navigate(['/goals/create']);
  }

  onGoalClick(goalId: number) {
    this.router.navigate(['/goals', goalId]);
  }

  onDeleteGoal(event: Event, goalId: number) {
    event.stopPropagation(); // Prevent card click when clicking delete
    
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    const userEmail = localStorage.getItem('email');
    
    this.http.delete(`http://localhost:8080/api/goals/${goalId}`, {
      headers: {
        'X-User-Email': userEmail!
      }
    }).subscribe({
      next: () => {
        console.log('Goal deleted');
        this.loadGoals(); // Reload the list
      },
      error: (error) => {
        console.error('Failed to delete goal', error);
        alert('Failed to delete goal');
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}