import { Injectable } from '@angular/core';
import { environment } from '../../environment/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  authh?: string; // Token
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
  developers?: string[];
  projects?: string[];
  cameras?: string[];
  services?: string[];
  phoneRequired?: boolean; // Indicates if phone verification is needed
  message?: string; // Optional message
  userId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authToken: string | null = null;
  private userRole: string | null = null;
  private username: string | null = null;
  private useremail: string | null = null;
  private phone: string | null = null;
  private accessibleDevelopers: string[] = [];
  private accessibleProjects: string[] = [];
  private accessibleCameras: string[] = [];
  private accessibleServices: string[] = [];
  userId: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage
    this.authToken = localStorage.getItem('authToken');
    this.userRole = localStorage.getItem('userRole');
    this.username = localStorage.getItem('username');
    this.useremail = localStorage.getItem('useremail');
    this.phone = localStorage.getItem('phone');
    this.accessibleDevelopers = JSON.parse(localStorage.getItem('accessibleDevelopers') || '[]');
    this.accessibleProjects = JSON.parse(localStorage.getItem('accessibleProjects') || '[]');
    this.accessibleCameras = JSON.parse(localStorage.getItem('accessibleCameras') || '[]');
    this.accessibleServices = JSON.parse(localStorage.getItem('accessibleServices') || '[]');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => {
        if (!response.phoneRequired) {
          this.setUserData(response);
        } else {
          this.userId = response.userId ? response.userId : null;
        }
      })
    );
  }

  resetpassword (token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });    
  }

  verifyPhone(phone: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/otp/send-otp`, { phone });
  }

  verifyOtp(phone: string, otp: string, userId?: string): Observable<AuthResponse> {

    const payload: any = { phone, otp };
    if (this.userId) {
      payload.userId = this.userId; // Add userId only if provided
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/otp/verify-otp`, payload).pipe(
      tap((response) => {
        this.setUserData(response);
      })
    );
  }

  private setUserData(response: AuthResponse): void {
    this.username = response.username || null;
    this.useremail = response.email || null;
    this.phone = response.phone || null;
    this.authToken = response.authh || null;
    this.userRole = response.role || null;
    this.accessibleDevelopers = response.developers || [];
    this.accessibleProjects = response.projects || [];
    this.accessibleCameras = response.cameras || [];
    this.accessibleServices = response.services || [];

    // Save to localStorage
    localStorage.setItem('username', this.username || '');
    localStorage.setItem('useremail', this.useremail || '');
    localStorage.setItem('phone', this.phone || '');
    localStorage.setItem('authToken', this.authToken || '');
    localStorage.setItem('userRole', this.userRole || '');
    localStorage.setItem('accessibleDevelopers', JSON.stringify(this.accessibleDevelopers));
    localStorage.setItem('accessibleProjects', JSON.stringify(this.accessibleProjects));
    localStorage.setItem('accessibleCameras', JSON.stringify(this.accessibleCameras));
    localStorage.setItem('accessibleServices', JSON.stringify(this.accessibleServices));
  }
  

  logout(): void {
    // Clear stored data
    this.authToken = null;
    this.userRole = null;
    this.username = null;
    this.useremail = null;
    this.phone = null;
    this.accessibleDevelopers = [];
    this.accessibleProjects = [];
    this.accessibleCameras = [];
    this.accessibleServices = [];

    // Remove from localStorage
    localStorage.clear();

    this.router.navigate(['/login']);
  }

  // Getter methods for auth data
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
}
