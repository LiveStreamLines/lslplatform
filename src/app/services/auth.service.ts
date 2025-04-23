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
  canAdduser: string;
  canGenerateVideoAndPics: string;
  phoneRequired?: boolean; // Indicates if phone verification is needed
  message?: string; // Optional message
  userId?: string;
  manual?: string;
  memoryRole?: string;
  invenotryRole?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.backend + "/api";
  private authToken: string | null = null;
  private userRole: string | null = null;
  private username: string | null = null;
  private useremail: string | null = null;
  private phone: string | null = null;
  private accessibleDevelopers: string[] = [];
  private accessibleProjects: string[] = [];
  private accessibleCameras: string[] = [];
  private accessibleServices: string[] = [];
  private canAdduser: string | null = null;
  private canGenerateVideoAndPics: string | null = null;
  private userId: string | null = null;
  private manual: string | null = null;
  private memoryRole: string | null = null;
  private inventoryRole: string | null = null ;

  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage
    this.userId = localStorage.getItem('userId');
    this.authToken = localStorage.getItem('authToken');
    this.userRole = localStorage.getItem('userRole');
    this.username = localStorage.getItem('username');
    this.useremail = localStorage.getItem('useremail');
    this.phone = localStorage.getItem('phone');
    this.accessibleDevelopers = JSON.parse(localStorage.getItem('accessibleDevelopers') || '[]');
    this.accessibleProjects = JSON.parse(localStorage.getItem('accessibleProjects') || '[]');
    this.accessibleCameras = JSON.parse(localStorage.getItem('accessibleCameras') || '[]');
    this.accessibleServices = JSON.parse(localStorage.getItem('accessibleServices') || '[]');
    this.canAdduser = localStorage.getItem('canAdduser');
    this.canGenerateVideoAndPics = localStorage.getItem('canGenerateVideoAndPics');
    this.manual = localStorage.getItem('manual');
    this.memoryRole = localStorage.getItem('memoryRole');
    this.inventoryRole = localStorage.getItem('inventoryRole');
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

  private setUserData(response: any): void {
    console.log(response);
    this.userId = response._id || null;
    this.username = response.name || null;
    this.useremail = response.email || null;
    this.phone = response.phone || null;
    this.authToken = response.authh || null;
    this.userRole = response.role || null;
    this.accessibleDevelopers = response.accessibleDevelopers || [];
    this.accessibleProjects = response.accessibleProjects || [];
    this.accessibleCameras = response.accessibleCameras || [];
    this.accessibleServices = response.accessibleServices || [];
    this.canAdduser = response.canAddUser || null;
    this.canGenerateVideoAndPics = response.canGenerateVideoAndPics || null;
    this.manual = response.manual || null;
    this.memoryRole = response.memoryRole || null;
    this.inventoryRole = response.invenotryRole || null;


    // Save to localStorage
    localStorage.setItem('userId', this.userId || '');
    localStorage.setItem('username', this.username || '');
    localStorage.setItem('useremail', this.useremail || '');
    localStorage.setItem('phone', this.phone || '');
    localStorage.setItem('authToken', this.authToken || '');
    localStorage.setItem('userRole', this.userRole || '');
    localStorage.setItem('accessibleDevelopers', JSON.stringify(this.accessibleDevelopers));
    localStorage.setItem('accessibleProjects', JSON.stringify(this.accessibleProjects));
    localStorage.setItem('accessibleCameras', JSON.stringify(this.accessibleCameras));
    localStorage.setItem('accessibleServices', JSON.stringify(this.accessibleServices));
    localStorage.setItem('canAdduser', JSON.stringify(this.canAdduser));
    localStorage.setItem('canGenerateVideoAndPics', JSON.stringify(this.canGenerateVideoAndPics));
    localStorage.setItem('manual', JSON.stringify(this.manual));
    localStorage.setItem('memoryRole', JSON.stringify(this.memoryRole));
    localStorage.setItem('inventoryRole', JSON.stringify(this.inventoryRole));

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
    this.canAdduser = null;
    this.canGenerateVideoAndPics = null;
    this.userId = null;
    this.manual = null;
    this.memoryRole = null;
    this.inventoryRole = null;
   
    // Remove from localStorage
    localStorage.clear();

    this.router.navigate(['/login']);
  }

  getUserId(): string | null {
    return this.userId;
  }

  getManual(): string | null {
    return this.manual;
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

  getCanAddUser(): string | null {
    return this.canAdduser;
  }

  getCanGenerateVideoAndPics(): string | null {
    return this.canGenerateVideoAndPics;
  }

  getMemoryRole(): string | null {
    return this.memoryRole;
  }

  getInentoryRole(): string | null {
    return this.inventoryRole;
  }

  isLoggedIn(): boolean {
    return !!this.authToken   || !!localStorage.getItem('authToken');
  }
}
