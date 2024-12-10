import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../services/project.service';
import { DeveloperService } from '../../services/developer.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projects: Project[] = [];
  developerId: any = '';
  developerTag: string = '';
  loading: boolean = true;
  logopath: string = 'http://5.9.85.250:5000/';
  userRole: string | null = null;
  filteredProjects: Project[] = [];
  accessibleProjects: string[] = []; // List of accessible project IDs

  constructor(
    private projectService: ProjectService, 
    private developerService: DeveloperService,
    private authService: AuthService,
    private route: ActivatedRoute, 
    private router: Router, 
    ) {}

  ngOnInit(): void {
     // Get the developer ID from the route parameters
    this.developerTag = this.route.snapshot.paramMap.get('developerTag')!;
    this.developerService.getDeveloperIdByTag(this.developerTag).subscribe(
      (developerId: string | undefined) => {
      if (developerId) {
        this.developerId = developerId;
      } else {
        console.error('Developer not found');
      }
    });
    // Get user role and accessible projects
    this.userRole = this.authService.getUserRole();
    this.accessibleProjects = this.authService.getAccessibleProjects();

     // Fetch the projects for the selected developer
    this.projectService.getProjectsByDeveloper(this.developerId).subscribe({
      next: (data: Project[]) => {
        this.projects = data.map(project => ({
          ...project,
          logo: this.logopath + project.logo
        }));

         // Filter projects based on role and accessible projects
         this.filteredProjects = this.userRole === 'Admin'
         ? this.projects // Admins see all projects
         : this.projects.filter((project) =>
             this.accessibleProjects.includes(project._id)
         );
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
        this.loading = false;
      },
      complete: () => {
        console.log('Project under Developer ' + this.developerTag  + ' loading complete.');
      }
    });
  }

   // This method is called when a project is clicked
   onProjectClick(project: Project): void {
    this.router.navigate([`/main/services/${this.developerTag}/${project.projectTag}`]);
  }

  goBack(): void {
    this.router.navigate(['/home']);  // Navigate to the developer list (home) route
  }

}
