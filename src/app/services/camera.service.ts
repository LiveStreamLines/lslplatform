import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Camera } from '../models/camera.model';
import { AuthService } from './auth.service';  // To access the auth token

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  
  private apiUrl = 'https://lslcloud.com/api/main/projects/cameras';  // API base URL for fetching cameras
  private cameras: Camera[] = [];
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch cameras by project ID
  getCamerasByProject(projectId: string): Observable<Camera[]> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'authh': authh ? authh : ''  // Send the authh header
    });
    
    return this.http.get<any>(`${this.apiUrl}/${projectId}`, { headers }).pipe(
      map((response) => response.cameras)  // Extract only the 'cameras' array
    );
  }



}
