import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoRequestService {
  private apiUrl = 'http://5.9.85.250:5000/api/video'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getPhotoRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/photoRequest`);
  }
}
