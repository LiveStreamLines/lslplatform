import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MatTabsModule],  // Import FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  phone: string = '';
  otp: string = '';
  loginError: string | null = null;
  isOtpSent: boolean = false;
  isPhoneRequired: boolean = false;
  isPhoneSubmitted: boolean = false;
  userId: string | null = null;
  loading: boolean = false; // Flag to manage loading state


  constructor(private authService: AuthService, private router: Router, private headerService: HeaderService) {}


  ngOnInit(): void {
    this.headerService.showHeaderAndSidenav = false;  
  }

  onLogin(): void {
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.phoneRequired) {
          // If phone verification is required
          this.isPhoneRequired = true;
        } else {
          // Login successful
          this.router.navigate(['home']);
          this.headerService.showHeaderAndSidenav = true;
        }
      },
      error: (err) => {
        this.loading = false;
        this.loginError = err.error.msg;
        console.error('Login failed:', err);
      },
    });
  }

  // Send OTP
  sendOtp(): void {
    this.loading = true;
    this.authService.verifyPhone(this.phone).subscribe({
      next: () => {
        this.loading = false;
        this.isOtpSent = true;
        this.isPhoneSubmitted = true;
        console.log('OTP sent successfully');
      },
      error: (err) => {
        this.loading = false;
        this.loginError = 'Failed to send OTP.';
        console.error('Error:', err);
      },
    });
  }

  // Verify OTP
  verifyOtp(): void {
    this.loading = true;
    this.authService.verifyOtp(this.phone, this.otp).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['home']); // Redirect to dashboard on success
        this.headerService.showHeaderAndSidenav = true;
      },
      error: (err) => {
        this.loading = false;
        this.loginError = 'Failed to verify OTP.';
        console.error('Error:', err);
      },
    });
  }

  
  
}