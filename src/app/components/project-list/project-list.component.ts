import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { SidenavComponent } from '../sidenav/sidenav.component';  // Import Sidenav
import { HeaderComponent } from '../header/header.component';  // Import Header

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, SidenavComponent, HeaderComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projects: Project[] = [];
  developerId: string = '';
  loading: boolean = true;

  constructor(
    private projectService: ProjectService, 
    private route: ActivatedRoute, 
    private router: Router, 
    ) {}

  ngOnInit(): void {
     // Get the developer ID from the route parameters
     this.developerId = this.route.snapshot.paramMap.get('id') || '';
     // Fetch the projects for the selected developer
    this.projectService.getProjectsByDeveloper(this.developerId).subscribe({
      next: (data: Project[]) => {
        this.projects = data.map(project => ({
          ...project,
          logo: `https://lslcloud.com/media/${project.logo}`
        }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
        this.loading = false;
      },
    });
  }

   // This method is called when a project is clicked
   onProjectClick(project: Project): void {
    this.router.navigate([`/project/${project._id}/cameras`], {
      queryParams: { developerId: this.developerId }  // Pass developerId as a query parameter
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);  // Navigate to the developer list (home) route
  }

}
