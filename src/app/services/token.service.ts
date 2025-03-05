import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environments';
import { AuthService } from './auth.service'; // Import AuthService
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private apiUrl = environment.backend + '/api/tokens'; // Backend endpoint

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Save tokens and expiry times in the backend
   */
  saveTokens(accessToken: string, accessTokenExpiry: number, streamToken: string, streamTokenExpiry: number): Observable<any> {
   // const authh = this.authService.getAuthToken();
   // const headers = new HttpHeaders({ 'Authorization': authh ? `Bearer ${authh}` : '' });

    const body = {
      accessToken,
      accessTokenExpiry,
      streamToken,
      streamTokenExpiry
    };

//    return this.http.post(`${this.apiUrl}/save`, body, { headers });
    return this.http.post(`${this.apiUrl}/save`, body);

  }

  getAllTokens(): Observable<{ accessToken: string, accessTokenExpiry: number, streamToken: string, streamTokenExpiry: number }> {
    //const authh = this.authService.getAuthToken();
    //const headers = new HttpHeaders({ 'Authorization': authh ? `Bearer ${authh}` : '' });

    return this.http.get<any>(`${this.apiUrl}/all`).pipe(
      tap(response => console.log("All Tokens Fetched:", response)),
      map(response => ({
        accessToken: response[0].accessToken,
        accessTokenExpiry: response[0].accessTokenExpiry,
        streamToken: response[0].streamToken,
        streamTokenExpiry: response[0].streamTokenExpiry
      }))
    );
  }
}
