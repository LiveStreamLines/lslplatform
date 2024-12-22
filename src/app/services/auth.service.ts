import { Injectable } from '@angular/core';
import { environment } from '../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authToken: string | null = null;
  private userRole: string | null = null;
  private username: string | null = null;
  private useremail: string | null = null;
  private accessibleDevelopers: string[] = [];
  private accessibleProjects: string[] = [];
  private accessibleCameras: string[] = [];
  private accessibleServices: string[] = [];


  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage
    this.authToken = localStorage.getItem('authToken');
    this.userRole = localStorage.getItem('userRole');
    this.username = localStorage.getItem('username');
    this.useremail = localStorage.getItem('useremail');
    this.accessibleDevelopers = JSON.parse(localStorage.getItem('accessibleDevelopers') || '[]');
    this.accessibleProjects = JSON.parse(localStorage.getItem('accessibleProjects') || '[]');
    this.accessibleCameras = JSON.parse(localStorage.getItem('accessibleCameras') || '[]');
    this.accessibleServices = JSON.parse(localStorage.getItem('accessibleCameras') || '[]');
  }

  
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: any) => {
        this.username = response.username;
        this.useremail = response.email;
        this.authToken = response.authh;
        this.userRole = response.role;
        this.accessibleDevelopers = response.developers;
        this.accessibleProjects = response.projects;
        this.accessibleCameras = response.cameras;
        this.accessibleServices = response.services;

        // Save to localStorage
        localStorage.setItem('username', this.username || '');
        localStorage.setItem('useremail', this.useremail || '');
        localStorage.setItem('authToken', this.authToken || '');
        localStorage.setItem('userRole', this.userRole || '');
        localStorage.setItem('accessibleDevelopers', JSON.stringify(this.accessibleDevelopers));
        localStorage.setItem('accessibleProjects', JSON.stringify(this.accessibleProjects));
        localStorage.setItem('accessibleCameras', JSON.stringify(this.accessibleCameras));
        localStorage.setItem('accessibleServices', JSON.stringify(this.accessibleServices));

      })
    );
  }

  resetpassword (token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });    
  }

   // Verify Phone Number
   verifyPhone(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/send-otp`, { phone });
  }

  // Verify OTP
  verifyOtp(phone: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/otp/verify-otp`, { phone, otp }).pipe(
      tap((response: any) => {
        this.authToken = response.authh;

        this.userRole = response.role;
        this.accessibleDevelopers = response.developers;
        this.accessibleProjects = response.projects;
        this.accessibleCameras = response.cameras;
        this.accessibleServices = response.services;
  
        // Save to localStorage
        localStorage.setItem('authToken', this.authToken || '');
        localStorage.setItem('userRole', this.userRole || '');
        localStorage.setItem('accessibleDevelopers', JSON.stringify(this.accessibleDevelopers));
        localStorage.setItem('accessibleProjects', JSON.stringify(this.accessibleProjects));
        localStorage.setItem('accessibleCameras', JSON.stringify(this.accessibleCameras));
        localStorage.setItem('accessibleServices', JSON.stringify(this.accessibleServices));
      })
    );
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  getUsername(): string | null {
    return this.username;
  }

  getUserRole(): string | null {
    return this.userRole;
  }

  getAccessibleDevelopers(): string[] {
    return this.accessibleDevelopers;
  }

  getAccessibleProjects(): string[] {
    return this.accessibleProjects;
  }

  getAccessibleServices(): string[] {
    return this.accessibleServices;
  }

  getAccessibleCameras(): string[] {
    return this.accessibleCameras;
  }

  isLoggedIn(): boolean {
    return !!this.authToken || !!localStorage.getItem('authToken');
  }

  logout(): void {
    // Clear stored data
    this.authToken = null;
    this.userRole = null;
    this.accessibleDevelopers = [];
    this.accessibleProjects = [];
    this.accessibleCameras = [];
    this.accessibleServices = [];

    // Remove from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessibleDevelopers');
    localStorage.removeItem('accessibleProjects');
    localStorage.removeItem('accessibleCameras');
    localStorage.removeItem('accessibleServices');

    this.router.navigate(['/login']);
  }
}
