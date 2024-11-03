import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // For date functionality
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { CameraDetailService } from '../../services/camera-detail.service';
import { CameraDetail } from '../../models/camera-detail.model';
import { CameraCompareComponent } from '../camera-compare/camera-compare.component';


@Component({
  selector: 'app-camera-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatButton,
    MatIcon,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormField,
    FormsModule, 
    CameraCompareComponent
  ],
  templateUrl: './camera-detail.component.html',  
  styleUrls: ['./camera-detail.component.scss']
})
export class CameraDetailComponent implements OnInit {
  projectId!: any;
  developerId!: any;  
  projectTag!: string;
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
  path: string = ''; 
  loadingLargePicture: boolean = false;  // Add loading state for large picture
  selectedThumbnail: string = '';  // Add state for selected thumbnail
  selectedDate: Date = new Date(); // This will be bound to ngModel
  mode: string = 'single';  // Default view mode
  lensX: number = 0;  // Position of the zoom lens
  lensY: number = 0;
  backgroundPosition: string = '0px 0px';  // Background position for zoomed view
  backgroundSize: string = '200%';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private cameraDetailService: CameraDetailService,
  ) {}

  ngOnInit(): void {
    this.cameraName = this.route.snapshot.params['cameraName'];
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
               this.getCameraDetails();  // Now that we have the projectId, fetch the cameras
             } else {
               console.error('Project not found.');
             }
           });
        } else {
          console.error('Developer not found.');
        }
      });
  }

  getCameraDetails(date1: string = '', date2: string = ''): void {
    console.log(date1, date2);
    //this.cameraDetailService.getCameraDetails(this.projectId, this.cameraName, date1, date2)
    this.cameraDetailService.getCameraDetails(this.developerTag, this.projectTag,this.cameraName,date1,date2)
    .subscribe({
      next: (data: CameraDetail) => {
        this.date2Pictures = data.date2Photos.map(photo => photo.toString());
        this.path = data.path;
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

  formatTimestamp(timestamp: string): string {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(8, 10);
    const minute = timestamp.substring(10, 12);
    const second = timestamp.substring(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

 
  // Get the full URL for the large picture
  getLargePictureUrl(picture: string): string {
    //return `https://lslcloud.com/photos/${this.developerTag}/${this.projectTag}/${this.cameraName}/large/${picture}.jpg`;
    return `${this.path}/large/${picture}.jpg` ;
  }

  // Get the full URL for the thumbnail picture
  getThumbPictureUrl(picture: string): string {
    //return `https://lslcloud.com/photos/${this.developerTag}/${this.projectTag}/${this.cameraName}/thumbs/${picture}.jpg`;
    return `${this.path}/thumbs/${picture}.jpg` ;;
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

  setMode(mode: string): void {

    this.mode = mode;  // Set the current mode
    console.log(`Mode set to: ${mode}`);
    // Implement different view modes here
    switch (mode) {
      case 'single':
        // Handle single view
        break;
      case 'studio':
        // Handle studio view
        break;
      case 'zoom':
        // Handle zoom view
        break;
      case 'compare':
        
        break;
    }
  }
  
  generateVideo(): void {
    console.log('Generating video...');
    // Implement the functionality to generate video
  }
  
  generatePhoto(): void {
    console.log('Generating photo...');
    // Implement the functionality to generate photo
  }
  
  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate : Date = event.value !;
    const formattedDate = this.formatDate(selectedDate);  // Format the date to yyyymmdd
  
    // Fetch camera details with the selected date
    this.getCameraDetails('', formattedDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Ensure two digits
    const day = date.getDate().toString().padStart(2, '0');  // Ensure two digits
    return `${year}${month}${day}`;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mode !== 'zoom') return;

      const img = event.target as HTMLImageElement;
      const rect = img.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      // Set lens position
      this.lensX = x - 100;  // Center lens
      this.lensY = y - 100;
  
      // Set background position based on image natural dimensions
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      this.backgroundPosition = `${xPercent}% ${yPercent}%`;
  
  }

  hideZoom(): void {
    this.lensX = 0;
    this.lensY = 0;
    this.backgroundPosition = '0% 0%';
  }

  goBack(): void {
    this.router.navigate([`/main/${this.developerTag}/${this.projectTag}`]);
  }

}
