import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.errorMessage = '';

    const loginRequest = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/api/auth/login', loginRequest)
      .subscribe({
        next: (response) => {
          // Store token and user info
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', response.email);
          localStorage.setItem('fullName', response.fullName);
          
          console.log('Login successful!', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid email or password';
        }
      });
  }
}