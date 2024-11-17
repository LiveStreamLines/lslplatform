import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // To access the auth token


@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = 'http://5.9.85.250:5000/api/video/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  generateVideo(payload: {
    developerId: string;
    projectId: string;
    cameraId: string;
    date1: string;
    date2: string;
    hour1: string;
    hour2: string;
    duration: number;
  }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
