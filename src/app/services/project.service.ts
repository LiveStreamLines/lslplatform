import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // To access the auth token

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://lslcloud.com/api/main/developer';  // Base URL for fetching projects

  constructor(private http: HttpClient, private authService: AuthService) {}


  // Fetch projects by developer ID
  getProjectsByDeveloper(developerId: string): Observable<Project[]> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService

    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'authh': authh ? authh : ''  // Send the authh header
    });

    return this.http.get<Project[]>(`${this.apiUrl}/${developerId}`, { headers });
  }

}
