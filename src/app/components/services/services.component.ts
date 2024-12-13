import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { Developer } from '../../models/developer.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatListModule, MatIconModule, MatGridListModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  developerTag!: string;
  developerName!: string;
  projectTag!: string;
  projectName!: string;
  filteredServices: any[] = [];
  accessibleServices: string[] = [];
  userRole: string | null = null;


  services = [
    { name: 'Timelapse', icon: 'timelapse', route: '/timelapse' },
    { name: 'Drone Shooting', icon: 'flight', route: '/drone-shooting' },
    { name: 'Site Photography & Videography', icon: 'camera_alt', route: '/site-photography' },
    // { name: 'Site ', icon: 'videocam', route: '/site-videography' },
    { name: '360 Photography & Videography', icon: '360', route: '/360-photography' },
    // { name: '360 ', icon: 'movie', route: '/360-videography' },
    { name: 'Satellite Imagery', icon: 'satellite', route: '/satellite-imagery' }
  ];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute, 
    private router: Router, 
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private authService: AuthService) {
    // Retrieve the route parameters
    this.route.params.subscribe(params => {
      this.developerTag = params['developerTag'];
      this.projectTag = params['projectTag'];
    });
  }

  
  ngOnInit(): void {
    this.developerService.getDeveloperIdByTag(this.developerTag).subscribe({
        next: (developer: Developer[]) => {
          this.developerName = developer[0].developerName;
          this.projectService.getProjectIdByTag(this.projectTag).subscribe({
            next: (projects: Project[])=>{
              this.projectName = projects[0].projectName;
              this.breadcrumbService.setBreadcrumbs([
                { label: 'Home ', url: '/home' },
                { label: `${this.developerName}`, url: `home/${this.developerTag}` },
                { label: `${this.projectName}`},
              ]);
            },
            error: (err: any) => {
              console.log(err);
            }
          });
        },
        error:(err: any) => {
          console.log(err);
        }
    });   

    // Get user role and accessible projects
    this.userRole = this.authService.getUserRole();
    this.accessibleServices = this.authService.getAccessibleServices();
     // Filter projects based on role and accessible projects
     this.filteredServices = this.userRole === 'Admin'
     ? this.services // Admins see all projects
     : this.services.filter((services) =>
         this.accessibleServices.includes(services.name)
     );  

  }


  navigateTo(serviceRoute: string) {

    // Navigate to the selected service, including developerTag and projectTag
    this.router.navigate([
      `main/services/${this.developerTag}/${this.projectTag}/${serviceRoute}`
    ]);

  }

  goBack(): void {
    this.router.navigate([`/home/${this.developerTag}`]);  // Go back to the project list with developer ID  }
  }
}
