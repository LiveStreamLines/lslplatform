import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Developer } from '../models/developer.model';
import { AuthService } from './auth.service';  // Import AuthService to access the auth token


@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private apiUrl = 'https://lslcloud.com/api/main/developers';  // API URL for fetching developers
  //private apiUrl = 'http://192.168.8.73:5000/api/main/developers';  // API URL for fetching developers

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch all developers
  getAllDevelopers(): Observable<Developer[]> {
    const authh = this.authService.getAuthToken();  // Get auth token from AuthService
    console.log(authh);
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'authh': authh ? authh : ''  // Send authh header
    });


    return this.http.get<Developer[]>(this.apiUrl, { headers });
  }
}
