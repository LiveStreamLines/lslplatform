import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  // Method to fetch weather by time
  getWeatherByTime(time: string): Observable<any> {
    const apiUrl = `http://5.9.85.250:5000/api/weather?time=${time}`;
    return this.http.get<any>(apiUrl);
  }
}