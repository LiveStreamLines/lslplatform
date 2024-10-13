import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { AuthService } from './auth.service';  // To access the auth token

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://lslcloud.com/api/main/developer';  // Base URL for fetching projects
  private projects: Project[] = [];  // Store projects here

  constructor(private http: HttpClient, private authService: AuthService) {}
  // Fetch projects by developer ID
  getProjectsByDeveloper(developerId: string): Observable<Project[]> {
    const authh = this.authService.getAuthToken();  // Get the auth token from AuthService
    // Set the custom header with the authh token
    const headers = new HttpHeaders({
      'authh': authh ? authh : ''  // Send the authh header
    });
      return this.http.get<Project[]>(`${this.apiUrl}/${developerId}`, { headers }).pipe(
        tap((data) => {
          this.projects = data;  // Store the list of project
        })
      );
  }

  getProjectIdByTag(developerId: string, projectTag: string): Observable<string | undefined> {
    if (this.projects.length > 0) {
      // If projects are already loaded, return the ID
      return of(this.findProjectIdByTag(projectTag));
    } else {
      // Otherwise, fetch projects and then find the ID
      return this.getProjectsByDeveloper(developerId).pipe(
        map(() => this.findProjectIdByTag(projectTag))
      );
    }
  }
  
  // Helper function to find the project ID by tag
  private findProjectIdByTag(projectTag: string): string | undefined {
    const project = this.projects.find(proj => proj.projectTag === projectTag);
    return project ? project._id : undefined;
  }
}
