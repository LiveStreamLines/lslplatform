import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://5.9.85.250:5000/api';
  private authToken: string | null = null;
  private userRole: string | null = null;
  private accessibleDevelopers: string[] = [];
  private accessibleProjects: string[] = [];
  private accessibleCameras: string[] = [];

  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage
    this.authToken = localStorage.getItem('authToken');
    this.userRole = localStorage.getItem('userRole');
    this.accessibleDevelopers = JSON.parse(localStorage.getItem('accessibleDevelopers') || '[]');
    this.accessibleProjects = JSON.parse(localStorage.getItem('accessibleProjects') || '[]');
    this.accessibleCameras = JSON.parse(localStorage.getItem('accessibleCameras') || '[]');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: any) => {
        this.authToken = response.authh;
        this.userRole = response.role;
        this.accessibleDevelopers = response.developers;
        this.accessibleProjects = response.projects;
        this.accessibleCameras = response.cameras;

        // Save to localStorage
        localStorage.setItem('authToken', this.authToken || '');
        localStorage.setItem('userRole', this.userRole || '');
        localStorage.setItem('accessibleDevelopers', JSON.stringify(this.accessibleDevelopers));
        localStorage.setItem('accessibleProjects', JSON.stringify(this.accessibleProjects));
        localStorage.setItem('accessibleCameras', JSON.stringify(this.accessibleCameras));
      })
    );
  }

  getAuthToken(): string | null {
    return this.authToken;
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

    // Remove from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessibleDevelopers');
    localStorage.removeItem('accessibleProjects');
    localStorage.removeItem('accessibleCameras');

    this.router.navigate(['/login']);
  }
}
