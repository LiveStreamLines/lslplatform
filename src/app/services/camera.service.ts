import { Injectable } from '@angular/core';
import { environment } from '../../environment/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Camera } from '../models/camera.model';
import { AuthService } from './auth.service';  // To access the auth token

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  
  private apiUrl =   environment.backend + '/api/cameras/';
  private cameras: Camera[] = [];
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch cameras by project ID
  getCamerasByProject(projectId: string): Observable<Camera[]> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    
    return this.http.get<any>(`${this.apiUrl}proj/${projectId}`, { headers }).pipe(
      map((response) => response)  // Extract only the 'cameras' array
      // tap((data) => {
      //   this.cameras = data;  // Store the list of project
      // })
    );
  }

  getCameraById(cameraId: string) {
    const authh = this.authService.getAuthToken(); 
    const headers = new HttpHeaders({ 
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    return this.http.get<Camera>(`${this.apiUrl}/${cameraId}`, { headers });
  }

  getLastPicture():  Observable<any[]>  {
    const authh = this.authService.getAuthToken(); 
    const headers = new HttpHeaders({ 
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    return this.http.get<any[]>(`${this.apiUrl}pics/last`,{ headers });
  }

  addOrUpdateProject(formData: FormData, isEditMode: boolean, projectId?: string): Observable<any> {
    const authh = this.authService.getAuthToken(); 
    const headers = new HttpHeaders({ 
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    if (isEditMode && projectId) {
      return this.http.put(`${this.apiUrl}/${projectId}`, formData, { headers });
    } else {
      return this.http.post(`${this.apiUrl}/`, formData, { headers });
    }
  }

  addCamera(formData: FormData){
    const authh = this.authService.getAuthToken(); 
    const headers = new HttpHeaders({ 
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    return this.http.post(`${this.apiUrl}/`, formData, { headers });
  }

  updateCamera(cameraId: any, formData: FormData){
    const authh = this.authService.getAuthToken(); 
    const headers = new HttpHeaders({ 
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
    });
    return this.http.put(`${this.apiUrl}/${cameraId}`, formData, { headers });
  }



}
