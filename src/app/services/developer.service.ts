import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Developer } from '../models/developer.model';
import { AuthService } from './auth.service';  // Import AuthService to access the auth token


@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private apiUrl = 'https://lslcloud.com/api/main/developers';  // API URL for fetching developers
  //private apiUrl = 'http://192.168.8.73:5000/api/main/developers';  // API URL for fetching developers
  private developers: Developer[] = [];  // Store developers here

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch all developers
  getAllDevelopers(): Observable<Developer[]> {
    const authh = this.authService.getAuthToken();  // Get auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'authh': authh ? authh : ''  // Send authh header
    });
    // if (this.developers.length > 0) {
    //   // Return the developers if already loaded
    //   return of(this.developers);
    // } else {
      return this.http.get<Developer[]>(this.apiUrl, { headers }).pipe(
        tap((data)=> {
          this.developers = data;
        })
      );
    //}
  }

  getDeveloperIdByTag(developerTag: string): Observable<string | undefined> {
    if (this.developers.length > 0) {
      // If developers are already loaded, return the ID
      return of(this.findDeveloperIdByTag(developerTag));
    } else {
      // Otherwise, fetch developers and then find the ID
      return this.getAllDevelopers().pipe(
        map(() => this.findDeveloperIdByTag(developerTag))
      );
    }
  }
  
  // Helper function to find the developer ID by tag
  private findDeveloperIdByTag(developerTag: string): string | undefined {
    const developer = this.developers.find(dev => dev.developerTag === developerTag);
    return developer ? developer._id : undefined;
  }
}
