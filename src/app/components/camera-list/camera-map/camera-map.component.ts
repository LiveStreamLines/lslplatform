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
  selectedCamera: Camera | null = null;
  map: google.maps.Map | null = null;

 
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
  onMapReady(event: any): void {
    console.log('Map Ready Event:', event);

  // Check if the map instance is part of the event object
  if (event instanceof google.maps.Map) {
    this.map = event; // Assign the map instance
    this.updateLabelPositions();
  } else {
    console.error('Unexpected event object:', event);
  }
  }
  

  onMarkerClick(camera: Camera): void {
    this.selectedCamera = camera;
  }

  closeInfoPopup(): void {
    this.selectedCamera = null;
  }

  updateLabelPositions(): void {
    if (!this.map) return;

    this.cameras.forEach((camera) => {
      const latLng = new google.maps.LatLng(Number(camera.lat), Number(camera.lng));
      const point = this.map!.getProjection()?.fromLatLngToPoint(latLng);

      if (point) {
        camera.screenX = point.x;
        camera.screenY = point.y;
      }
    });
  }
  
}
