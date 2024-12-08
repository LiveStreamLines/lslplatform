import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl = 'http://5.9.85.250:5000/api/media'; 

  constructor(private http: HttpClient) {}

  submitMediaForm(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
    
}