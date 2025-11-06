import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation: Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Validation: Check password length
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    const registerRequest = {
      email: this.email,
      password: this.password,
      fullName: this.fullName
    };

    this.http.post<any>('http://localhost:8080/api/auth/register', registerRequest)
      .subscribe({
        next: (response) => {
          // Store token and user info
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', response.email);
          localStorage.setItem('fullName', response.fullName);
          
          this.successMessage = 'Registration successful! Redirecting...';
          console.log('Registration successful!', response);
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration failed', error);
          if (error.status === 400) {
            this.errorMessage = 'Email already exists or invalid data';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
  }
}