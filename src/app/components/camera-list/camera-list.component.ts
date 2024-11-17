import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { CameraService } from '../../services/camera.service';
import { ProjectService } from '../../services/project.service';
import { DeveloperService } from '../../services/developer.service';
import { Camera } from '../../models/camera.model';
import { CameraDetailService } from '../../services/camera-detail.service';
import { GoogleMapsModule } from '@angular/google-maps';  // Google Maps module
import { MatTabsModule } from '@angular/material/tabs';
import { CameraViewComponent } from './camera-view/camera-view.component';
import { CameraMapComponent } from './camera-map/camera-map.component';



@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [CommonModule, 
            GoogleMapsModule, 
            MatCardModule, 
            MatButtonModule,
            MatTabsModule,
            CameraViewComponent,
            CameraMapComponent
          ],  // Import Sidenav, Header, and GoogleMapsModule
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.scss']
})
export class CameraListComponent implements OnInit {

  cameras: Camera[] = [];
  projectId: any = '';  // Project ID from the route
  developerId: any = '';  // Store the developer ID
  developerTag: string = '';
  projectTag: string = '';
  loading: boolean = true;  // Loading state

   // Current active tab index
   activeTab: number = 0;

  constructor(
    private router: Router, 
    private cameraDetailService : CameraDetailService,
    private cameraService: CameraService, 
    private projectService: ProjectService,
    private developerService: DeveloperService,
    private route: ActivatedRoute, 
  ) {}

  ngOnInit(): void {
    // Get the project ID from the route parameters
    this.developerTag = this.route.snapshot.paramMap.get('developerTag')!;
    this.projectTag = this.route.snapshot.paramMap.get('projectTag')!;
         
      // Get Developer ID by developerTag
    this.developerService.getDeveloperIdByTag(this.developerTag).subscribe((developerId: string | undefined) => {
      if (developerId) {
         this.developerId = developerId;
         // Once we have the developerId, get the project ID
         this.projectService.getProjectIdByTag(this.developerId, this.projectTag).subscribe((projectId: string | undefined) => {
           if (projectId) {
             this.projectId = projectId;
             this.fetchCameras();  // Now that we have the projectId, fetch the cameras
           } else {
             console.error('Project not found.');
           }
         });
      } else {
        console.error('Developer not found.');
      }
    });
  }

  // Function to fetch the list of cameras
  fetchCameras(): void {
    this.cameraService.getCamerasByProject(this.projectId).subscribe({
      next: (data) => {
        this.cameras = data;  // Assign the cameras to the component
          this.cameras.forEach(camera => {
              // For each camera, fetch the first and last pictures
            // this.cameraDetailService.getCameraDetails(this.projectId, camera.camera)
            this.cameraDetailService.getCameraDetails(this.developerTag, this.projectTag,camera.camera) 
            .subscribe(
              {
                  next: (cameraDetail) => {
                    this.loading = false;  // Stop loading once the data is fetched
                    camera.firstPhoto =  cameraDetail.firstPhoto;
                    camera.lastPhoto = cameraDetail.lastPhoto;     
                    camera.path = cameraDetail.path;   
                  },
                  error: (err) => {
                    console.log ("This Camera has no pics");
                  }
              });
          });
       },
         error: (err) => {
        console.error('Error fetching cameras:', err);
        this.loading = false;  // Stop loading in case of error
      }
    });
  }  

  getPictureUrl(camera: string, photo: string): string {
    //return`https://lslcloud.com/photos/${this.developerTag}/${this.projectTag}/${camera}/large/${photo}.jpg`;  // Adjust path as needed
    if (camera && photo) {
      return `${camera}/large/${photo}.jpg` ;
    } else {
      return '';
    }
  }

  viewCameraDetails(camera: Camera): void {
    this.router.navigate([`/main/${this.developerTag}/${this.projectTag}/${camera.camera}`]);
  }

  // Function to switch tabs (in case we want to handle custom tab switching logic)
  onTabChange(index: number): void {
    this.activeTab = index;
  }

  formatTimestamp(timestamp: string): string {
    if (timestamp) {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    return `${year}-${month}-${day}`;}
    else {
      return 'Null';
    }
  }

  goBack(): void {
    this.router.navigate([`/main/${this.developerTag}`]);  // Go back to the project list with developer ID
  }
}
