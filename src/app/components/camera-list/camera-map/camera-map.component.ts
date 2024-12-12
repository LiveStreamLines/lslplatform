import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DeveloperService } from '../../../services/developer.service';
import { ProjectService } from '../../../services/project.service';
import { CameraService } from '../../../services/camera.service';
import { CameraDetailService } from '../../../services/camera-detail.service';
import { Camera } from '../../../models/camera.model';
import { GoogleMapsModule } from '@angular/google-maps';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-camera-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, FormsModule],
  templateUrl: './camera-map.component.html',
  styleUrl: './camera-map.component.css'
})
export class CameraMapComponent {

  // @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  // map!: google.maps.Map;
  developerTag!: string;
  projectTag!: string;
  developerId!: string;
  projectId!: string;
  cameras: Camera[] = [];

  cameras1 = [
    { lat: 37.7749, lng: -122.4194, name: 'Camera 1' },
    { lat: 34.0522, lng: -118.2437, name: 'Camera 2' },
    // Add other cameras here
  ];

  constructor (
    private route: ActivatedRoute,
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private cameraService: CameraService,
  ) {}

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
                 //console.log (cameras);
                 this.loadMap();
               },
               error: (err) => {
                 console.error('Error fetching cameras:', err);
               },
             });        
           },
           error:  (err: any) => {
             console.error('Project not found.');
           }
        });
     
 }

  ngAfterViewInit(): void {
    //this.loadMap();
  }

  loadMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: Number(this.cameras[0].lat), lng: Number(this.cameras[0].lng)},
      zoom: 10,
    };

   // this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
   // this.addMarkers();
  }

  // addMarkers(): void {
  //   this.cameras.forEach((camera) => {
  //     const marker = new google.maps.marker.AdvancedMarkerElement({
  //       position: { lat: Number(camera.lat), lng: Number(camera.lng) },
  //       map: this.map,
  //       title: camera.cameraDescription,
  //     });
  //   });
  // }
  
}
