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
  monthYear: string;
  isArchived: boolean;
  finalStreak: number;
  createdAt: string;
  archivedAt?: string;
}

interface MonthGroup {
  monthYear: string;
  goals: Goal[];
}

@Component({
  selector: 'app-previous-goals',
  imports: [CommonModule],
  templateUrl: './previous-goals.html',
  styleUrl: './previous-goals.css'
})
export class PreviousGoals implements OnInit {
  archivedGoals: Goal[] = [];
  groupedGoals: MonthGroup[] = [];
  loading = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadArchivedGoals();
  }

  loadArchivedGoals() {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<Goal[]>('http://localhost:8080/api/archive/goals', {
      headers: { 'X-User-Email': userEmail }
    }).subscribe({
      next: (response) => {
        this.archivedGoals = response;
        this.groupGoalsByMonth();
        this.loading = false;
        console.log('Archived goals loaded:', this.archivedGoals);
      },
      error: (error) => {
        console.error('Failed to load archived goals', error);
        this.loading = false;
      }
    });
  }

  groupGoalsByMonth() {
    const grouped = new Map<string, Goal[]>();

    this.archivedGoals.forEach(goal => {
      const monthYear = goal.monthYear;
      if (!grouped.has(monthYear)) {
        grouped.set(monthYear, []);
      }
      grouped.get(monthYear)!.push(goal);
    });

    // Convert map to array and sort by date (newest first)
    this.groupedGoals = Array.from(grouped.entries()).map(([monthYear, goals]) => ({
      monthYear,
      goals
    }));
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  goBack() {
    this.router.navigate(['/goals']);
  }
}