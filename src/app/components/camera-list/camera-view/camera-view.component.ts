import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatTab } from '@angular/material/tabs';
import { MatTabGroup } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CameraService } from '../../../services/camera.service';
import { CameraDetailService } from '../../../services/camera-detail.service';
import { DeveloperService } from '../../../services/developer.service';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-camera-view',
  standalone: true,
  imports: [MatSliderModule, FormsModule, MatTab, MatTabGroup, CommonModule, ReactiveFormsModule],
  templateUrl: './camera-view.component.html',
  styleUrl: './camera-view.component.css'
})
export class CameraViewComponent implements OnInit{

  cameras: any[] = [];
  selectedCameraId: string = '';
  images: string[] = [];  // This will hold image URLs from your API
  imageIndex: number = 0;
  developerTag!: string;
  projectTag!: string;
  developerId!: string;
  projectId!: string;
  path!: string;
  sliderInterval: any;


  constructor(
    private cameraService: CameraService,
    private cameraDetailService: CameraDetailService,
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private route: ActivatedRoute) {}


  ngOnInit() {
     // Get the project ID from the route parameters
     this.developerTag = this.route.snapshot.paramMap.get('developerTag')!;
     this.projectTag = this.route.snapshot.paramMap.get('projectTag')!;
          
       // Get Developer ID by developerTag
        this.projectService.getProjectIdByTag(this.projectTag).subscribe({
          next: (project: Project[]) => {
            this.projectId = project[0]._id
            this.cameraService.getCamerasByProject(this.projectId).subscribe({
                next: (cameras) => {
                  this.cameras = cameras;
                  if (this.cameras.length > 0) {
                    this.selectedCameraId = this.cameras[0].camera; // Set the first camera as selected
                    this.loadCameraImages(this.selectedCameraId); // Load images for the first camera
                  }
                },
                error: (err) => {
                  console.error('Error fetching cameras:', err);
                },
              });        
          }, 
          error: (err: any) => {
            console.error(err);
          }
        });
         
  }

  loadCameraImages(cameraId: string): void {
    //console.log('Number of cameras:', this.cameras.length);
    //console.log(this.cameras);
    this.cameraDetailService.getCameraPreview(this.developerTag, this.projectTag, cameraId).subscribe({
      next: (response) => {
        this.path = response.path;
        this.images = response.weeklyImages || []; // Update the list of images for the selected camera
        this.preloadImages();
        //this.startSliderMovement();
      },
      error: (err) => {
        console.error('Error fetching camera images:', err);
      },
    });
  }

  preloadImages() {
    this.images.forEach(image => {
      const img = new Image();
      img.src = this.getLargePictureUrl(image);
    });
  }

  getLargePictureUrl(picture: string): string {
    return `${this.path}large/${picture}.jpg`;
  }

  onCameraTabChange(index: number): void {
    console.log('Selected camera tab:', index);

    const selectedCamera = this.cameras[index];
    if (selectedCamera) {
      this.loadCameraImages(selectedCamera.camera);  // Pass the camera ID to load images
    }
  }

  startSliderMovement(): void {
    this.sliderInterval = setInterval(() => {
      if (this.imageIndex < this.images.length - 1) {
        this.imageIndex++;
      } else {
        this.imageIndex = 0;  // Loop back to the first image
      }
    }, 500);  // Move every 0.5 seconds
  }

  onSliderMove(event: any) {
    this.imageIndex = event.target.value; // Updates the image index to match the slider position
  }

}
