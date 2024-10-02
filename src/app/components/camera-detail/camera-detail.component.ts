import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';  // Import Sidenav
import { HeaderComponent } from '../../components/header/header.component';    // Import Header

@Component({
  selector: 'app-camera-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, SidenavComponent, HeaderComponent],
  templateUrl: './camera-detail.component.html',
  styleUrl: './camera-detail.component.css'
})
export class CameraDetailComponent implements OnInit{

  selectedDate: string = new Date().toISOString().split('T')[0];  // Default to today’s date
  imageUrls: any[] = [];  // To store the list of thumbnails and large image URLs
  selectedLargeImage: string = '';  // To hold the selected large image URL
  developer: string = '';  // Retrieved dynamically from route
  project: string = '';  // Retrieved dynamically from route
  cameraTag: string = '';  // Retrieved dynamically from route

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the dynamic parameters from the URL
    this.route.paramMap.subscribe(params => {
      this.project = params.get('projectId')!;  // Get projectId from route
      this.cameraTag = params.get('cameraTag')!;  // Get cameraTag from route

      // Load the images for the default date (today)
      this.loadImages();
    });
  }

  // Method to call the API and fetch images for the camera and selected date
  loadImages(): void {
    const formattedDate = this.selectedDate.replace(/-/g, '');  // Format date as yyyymmdd
    const apiUrl = `https://liveview.lslcloud.com/api2/v2/getCameraFiles/${this.developer}/${this.project}/${this.cameraTag}/${formattedDate}`;

    // Fetch the list of images for the selected camera
    this.http.get<string[]>(apiUrl).subscribe((imageFiles: string[]) => {
      // Map the API response to URLs for thumbnails and large images
      this.imageUrls = imageFiles.map(file => ({
        thumbUrl: `https://liveview.lslcloud.com/photos/${this.developer}/${this.project}/${this.cameraTag}/thumbs/${file}`,
        largeUrl: `https://liveview.lslcloud.com/photos/${this.developer}/${this.project}/${this.cameraTag}/large/${file}`
      }));

      // Set the first image as the default large image
      if (this.imageUrls.length > 0) {
        this.selectedLargeImage = this.imageUrls[0].largeUrl;
      }
    });
  }

  // Handle date change and reload images
  onDateChange(event: any): void {
    this.selectedDate = event.target.value;  // Update selected date
    this.loadImages();  // Reload images for the new date
  }

  // Set the large image when a thumbnail is clicked
  selectImage(largeImageUrl: string): void {
    this.selectedLargeImage = largeImageUrl;
  }

}
