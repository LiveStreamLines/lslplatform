import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { environment } from '../../environments/environment';
import { CameraDetail } from '../models/camera-detail.model';
import { AuthService } from './auth.service';  // Assuming you have AuthService to manage auth token

@Injectable({
  providedIn: 'root',
})
export class CameraDetailService {
  private apiUrl = 'https://lslcloud.com/api/main/projectcamerafiles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Method to get the camera details
  getCameraDetails(projectCode: string, cameraName: string): Observable<CameraDetail> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService
    const headers = new HttpHeaders({
        'authh': authh ? authh : ''  // Send the authh header
      });          
    return this.http.post<CameraDetail>(`${this.apiUrl}/${projectCode}/${cameraName}`,{ headers });
  }
}
