import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../services/project.service';
import { DeveloperService } from '../../services/developer.service';
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
  logopath: string = 'http://localhost:5000/';
  //logopath: string = 'https://lslcloud.com/media/';


  constructor(
    private projectService: ProjectService, 
    private developerService: DeveloperService,
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
     // Fetch the projects for the selected developer
    this.projectService.getProjectsByDeveloper(this.developerId).subscribe({
      next: (data: Project[]) => {
        this.projects = data.map(project => ({
          ...project,
          logo: this.logopath + project.logo
        }));
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
    this.router.navigate([`/main/${this.developerTag}/${project.projectTag}`]);
  }

  goBack(): void {
    this.router.navigate(['/home']);  // Navigate to the developer list (home) route
  }

}
