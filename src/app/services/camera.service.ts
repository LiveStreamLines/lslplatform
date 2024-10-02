import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // To access the auth token
import { Camera } from '../models/camera.model';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
 
  private apiUrl = 'https://lslcloud.com/api/main/projects/cameras';  // API base URL for fetching cameras

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch cameras by project ID
  getCamerasByProject(projectId: string): Observable<{ cameras: Camera[] }> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService

    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'authh': authh ? authh : ''  // Send the authh header
    });
    return this.http.get<{ cameras: Camera[] }>(`${this.apiUrl}/${projectId}`, { headers });

  }

}
