import { Injectable } from '@angular/core';
import { environment } from '../../environment/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.backend + '/api/users'; // Base URL for the user API
  private Authurl = environment.backend + '/api/auth'; // Base URL for the user API


  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get all users
  getAllUsers(): Observable<User[]> {
    const authh = this.authService.getAuthToken();  // Get auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });

    return this.http.get<User[]>(`${this.apiUrl}`,{ headers });
  }

  // Get a user by ID
  getUserById(id: string): Observable<User> {
    const authh = this.authService.getAuthToken();  // Get auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers });
  }

  getUserByEmail(email: string): Observable<string> {
    return this.http.get<string>(`${this.Authurl}/email/${email}`);
  }

  sendResetPasswordLink(userId: string, resetEmail: string) {
    return this.http.post<string>(`${this.Authurl}/reset-link`, { user_id: userId, reset_email: resetEmail });
  }

  // Add a new user
  addUser(user: any): Observable<User> {
    const authh = this.authService.getAuthToken();  // Get auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    return this.http.post<User>(`${this.apiUrl}`, user, { headers });
  }

  // Update an existing user
  updateUser(id: string, user: User): Observable<User> {
    const authh = this.authService.getAuthToken();  // Get auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers });
  }
 
  // Delete a user
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
