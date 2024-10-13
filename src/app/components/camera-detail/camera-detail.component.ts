import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { CameraDetailService } from '../../services/camera-detail.service';
import { CameraDetail } from '../../models/camera-detail.model';

@Component({
  selector: 'app-camera-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-detail.component.html',  
  styleUrls: ['./camera-detail.component.scss']
})
export class CameraDetailComponent implements OnInit {
  projectId!: any;
  projectTag!: string;
  developerId!: any;  // Developer ID to be passed as a query param
  developerTag!: string;
  cameraName!: string;
  cameraDetails!: CameraDetail;
  firstPhoto!: string;
  lastPhoto!: string;
  lastPictureUrl!: string;
  selectedPictureUrl!: string;
  photosByDate: any = {};
  date1Pictures: string[] = [];
  date2Pictures: string[] = [];
  loadingLargePicture: boolean = false;  // Add loading state for large picture
  selectedThumbnail: string = '';  // Add state for selected thumbnail

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private cameraService: CameraDetailService
  ) {}

  ngOnInit(): void {
    this.cameraName = this.route.snapshot.params['cameraName'];
    this.developerTag = this.route.snapshot.paramMap.get('developerTag')!;
    this.projectTag = this.route.snapshot.paramMap.get('projectTag')!;
    this.developerId = this.developerService.getDeveloperIdByTag(this.developerTag);
    this.projectId = this.projectService.getProjectIdByTag(this.projectTag, this.developerId);
    
    this.getCameraDetails();
  }

  getCameraDetails(): void {
    this.cameraService.getCameraDetails(this.projectId, this.cameraName)
    .subscribe({
      next: (data: CameraDetail) => {
        this.date2Pictures = data.date2Photos.map(photo => photo.toString());
  
        // Set the last picture from the `large` folder as the initially displayed picture
        const lastPhoto = this.date2Pictures[this.date2Pictures.length - 1];
        this.lastPictureUrl = this.getLargePictureUrl(lastPhoto);
        this.selectedPictureUrl = this.lastPictureUrl;
        this.selectedThumbnail = lastPhoto;  // Set the last photo as selected by default
      },
      error: (err: any) => {
        console.error('Error fetching camera details:', err);
      },
      complete: () => {
        console.log('Camera details loaded successfully.');
      }
    });
  }

 
  // Get the full URL for the large picture
  getLargePictureUrl(picture: string): string {
    return `https://lslcloud.com/photos/${this.developerTag}/${this.projectTag}/${this.cameraName}/large/${picture}.jpg`;
  }

  // Get the full URL for the thumbnail picture
  getThumbPictureUrl(picture: string): string {
    return `https://lslcloud.com/photos/${this.developerTag}/${this.projectTag}/${this.cameraName}/thumbs/${picture}.jpg`;
  }

  // Handle click on thumbnail to show the large picture
  onThumbnailClick(picture: string): void {
    this.loadingLargePicture = true;  // Start loading state
    this.selectedPictureUrl = '';  // This will temporarily "hide" the image

    setTimeout(() => {
      this.selectedPictureUrl = this.getLargePictureUrl(picture);  // Set the large picture URL
      this.selectedThumbnail = picture;  // Mark the selected thumbnail
    }, 100);  // Adding a small delay can help with a smooth transition

  }

  // Called when the large picture is fully loaded
  onLargePictureLoad(): void {
    console.log('Large picture loaded.');  // Debug log
    this.loadingLargePicture = false;  // Stop loading state
    const imgElement = document.querySelector('.large-picture') as HTMLElement;
    imgElement.classList.add('loaded');
  }

  // Handle image loading error
  onLargePictureError(): void {
    console.error('Failed to load large picture:', this.selectedPictureUrl);
    this.loadingLargePicture = false;
  }

  goBack(): void {
    this.router.navigate([`/main/${this.developerTag}/${this.projectTag}`]);
  }

}
