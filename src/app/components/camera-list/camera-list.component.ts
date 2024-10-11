import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CameraService } from '../../services/camera.service';
import { Camera } from '../../models/camera.model';
import { GoogleMapsModule } from '@angular/google-maps';  // Google Maps module

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],  // Import Sidenav, Header, and GoogleMapsModule
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.scss']
})
export class CameraListComponent implements OnInit {

  cameras: Camera[] = [];
  projectId: string = '';  // Project ID from the route
  developerId: string = '';  // Store the developer ID
  loading: boolean = true;  // Loading state

  constructor(
    private router: Router, 
    private cameraService: CameraService, 
    private route: ActivatedRoute, 
    ) {}

  ngOnInit(): void {
    // Get the project ID from the route parameters
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    
    // Get the developerId from the query parameters
    this.route.queryParams.subscribe(params => {
      this.developerId = params['developerId'] || '';
    });
    
    // Fetch the list of cameras for the given project
    this.cameraService.getCamerasByProject(this.projectId).subscribe({
      next: (data) => {
        this.cameras = data.cameras;  // Assign the cameras to the component
        this.loading = false;  // Stop loading once the data is fetched
      },
      error: (err) => {
        console.error('Error fetching cameras:', err);
        this.loading = false;  // Stop loading in case of error
      }
    });
  }

  viewCameraDetails(camera: Camera): void {
    this.router.navigate(['/project', camera.project, camera.camera]);
  }

  goBack(): void {
    this.router.navigate(['/projects', this.developerId]);  // Go back to the project list with developer ID
  }
}
