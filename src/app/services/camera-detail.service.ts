import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
//import { environment } from '../../environments/environment';
import { CameraDetail } from '../models/camera-detail.model';
import { AuthService } from './auth.service';  // Assuming you have AuthService to manage auth token

@Injectable({
  providedIn: 'root',
})
export class CameraDetailService {
  //private apiUrl = 'https://lslcloud.com/api/main/projectcamerafiles';
  private apiUrl = 'http://5.9.85.250:5000/api/camerapics';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Method to get the camera details
  // getCameraDetails(projectCode: string, cameraName: string,  date1: string = '', date2: string = ''): Observable<CameraDetail> {
  //   const authh = this.authService.getAuthToken();  // Get the auth token from AuthService
  //   const headers = new HttpHeaders({
  //       'authh': authh ? authh : ''  // Send the authh header
  //     });          
  //     // Construct the request body
  //     const body = {
  //       date1: date1,  // Send date1 (empty string if not provided)
  //       date2: date2   // Send date2 (can be formatted date string)
  //     };

  //   return this.http.post<CameraDetail>(`${this.apiUrl}/${projectCode}/${cameraName}`, body, { headers });
  // }

  getCameraDetails(developerTag: string, projectTag: string, cameraTag: string,  date1: string = '', date2: string = ''): Observable<CameraDetail> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
      });          
      // Construct the request body
      const body = {
        date1: date1,  // Send date1 (empty string if not provided)
        date2: date2   // Send date2 (can be formatted date string)
      };

    return this.http.post<CameraDetail>(`${this.apiUrl}/${developerTag}/${projectTag}/${cameraTag}/pictures`, body, { headers });
  }

  getCameraPreview(developerTag: string, projectTag: string, cameraTag: string): Observable<any> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService
    const headers = new HttpHeaders({
      'Authorization': authh ? `Bearer ${authh}` : ''  // Send authh header
      });          
      
    return this.http.get<CameraDetail>(`${this.apiUrl}/preview/${developerTag}/${projectTag}/${cameraTag}`, { headers });
  }

}