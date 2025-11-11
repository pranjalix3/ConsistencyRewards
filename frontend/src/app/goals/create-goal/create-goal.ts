import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-goal',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-goal.html',
  styleUrl: './create-goal.css'
})
export class CreateGoal {
  title = '';
  description = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.title.trim()) {
      this.errorMessage = 'Goal title is required';
      return;
    }

    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      this.errorMessage = 'Please login first';
      this.router.navigate(['/login']);
      return;
    }

    const goalRequest = {
      title: this.title,
      description: this.description
    };

    this.http.post<any>('http://localhost:8080/api/goals', goalRequest, {
      headers: {
        'X-User-Email': userEmail
      }
    }).subscribe({
      next: (response) => {
        console.log('Goal created!', response);
        this.successMessage = 'Goal created successfully! Redirecting...';
        
        setTimeout(() => {
          this.router.navigate(['/goals']);
        }, 1500);
      },
      error: (error) => {
        console.error('Failed to create goal', error);
        this.errorMessage = 'Failed to create goal. Please try again.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}