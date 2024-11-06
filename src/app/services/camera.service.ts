import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Camera } from '../models/camera.model';
import { AuthService } from './auth.service';  // To access the auth token

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  
  //private apiUrl = 'https://lslcloud.com/api/main/projects/cameras';  // API base URL for fetching cameras
  private apiUrl = 'http://5.9.85.250:5000/api/cameras/proj';
  private cameras: Camera[] = [];
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch cameras by project ID
  getCamerasByProject(projectId: string): Observable<Camera[]> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    
    return this.http.get<any>(`${this.apiUrl}/${projectId}`, { headers }).pipe(
      map((response) => response)  // Extract only the 'cameras' array
      // tap((data) => {
      //   this.cameras = data;  // Store the list of project
      // })
    );
  }



}
