import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'  // This ensures the service is available throughout the application
})
export class AuthService {
  private authUrl = 'https://liveview.lslcloud.com/api/user/login/';
  private authTokenKey = 'authh';  // Key for storing auth token in localStorage
  private developerIdsKey = 'developer_ids';
  private projectIdsKey = 'project_ids';


  constructor(private router: Router, private http: HttpClient) {}

  // Send login request to the API
  login(username: string, password: string, rememberMe: string): Observable<any> {
    const loginData = {
      username: username,
      password: password,
      rememberMe: rememberMe
    };

    // Return an observable to subscribe in the component
    return this.http.post(this.authUrl, loginData);
  }

  // Store the auth token, developers, and projects in localStorage
  setAuthData(authh: string, developers: string[], projects: string[]): void {
    localStorage.setItem(this.authTokenKey, authh);
    localStorage.setItem('developers', JSON.stringify(developers));
    localStorage.setItem('projects', JSON.stringify(projects));
    const expiryTime = new Date().getTime() + (60 * 60 * 1000); // 1 hour in milliseconds
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  }

   // Retrieve developer and project IDs
   getDeveloperIds(): string[] {
    return JSON.parse(localStorage.getItem(this.developerIdsKey) || '[]');
  }

  getProjectIds(): string[] {
    return JSON.parse(localStorage.getItem(this.projectIdsKey) || '[]');
  }


  // Retrieve the auth token from localStorage
  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

   // Check if the token is expired
   isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem('tokenExpiry');
    if (!expiryTime) {
      return true;
    }
    const currentTime = new Date().getTime();
    return currentTime > +expiryTime;  // Token is expired if current time is greater than expiry time
  }

  // Remove auth token (logout)
  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('developers');
    localStorage.removeItem('projects');
    this.router.navigate(['/login']);
  }

   // Check if the user is logged in
   isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }
}
