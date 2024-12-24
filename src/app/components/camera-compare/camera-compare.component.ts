import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CameraDetailService } from '../../services/camera-detail.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor and ngIf
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/input';
import { CameraCompareService } from '../../services/camera-compare-service';

@Component({
  selector: 'app-camera-compare',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule ,MatDatepickerModule],
  templateUrl: './camera-compare.component.html',
  styleUrl: './camera-compare.component.css'
})
export class CameraCompareComponent implements OnInit {
  @Input() projectId!: string; // Receiving projectId from parent
  @Input() cameraName!: string; // Receiving cameraName from pare

  projectTag!: string;
  developerTag!: string;
  date1Pictures: string[] = [];
  date2Pictures: string[] = [];
  selectedDate1Picture: string = '';
  selectedDate2Picture: string = '';
  sliderPosition: number = 50; // Starting split between images for visual comparison
  selectedDate1:Date = new Date(); // This will be bound to ngModel
  selectedDate2: Date = new Date(); // This will be bound to ngModel
  selectedDate1Thumbnail!: string;
  selectedDate2Thumbnail!: string;
  path: string = '';

  loadingLeft = false;
  loadingRight = false;
  
  constructor(
   private route: ActivatedRoute,
   private cameraDetailService: CameraDetailService,
   private cameraCompareService: CameraCompareService
  ) {}

  ngOnInit(): void {
    this.developerTag = this.route.snapshot.paramMap.get('developerTag')!;
    this.projectTag = this.route.snapshot.paramMap.get('projectTag')!;

    if (this.projectId && this.cameraName) {
      this.loadComparisonPhotos();
      //this.cameraCompareService.loadComparisonPhotos(this.cameraName);
    }
  }

  // Fetch both date1 and date2 pictures
  loadComparisonPhotos(date1: string = '', date2: string = ''): void {
//    this.cameraDetailService.getCameraDetails(this.projectId, this.cameraName, date1, date2)
    this.cameraDetailService.getCameraDetails(this.developerTag, this.projectTag,this.cameraName,date1,date2)
    .subscribe(data => {
      this.date1Pictures = data.date1Photos.map(photo => photo.toString());
      this.date2Pictures = data.date2Photos.map(photo => photo.toString());
      this.path = data.path;
     // console.log("Date 1 Pictures:", this.date1Pictures);  // Debug log
     // console.log("Date 2 Pictures:", this.date2Pictures);  // Debug log
      // Set default selected pictures
      if (this.date1Pictures.length > 0) {
        const lastPhotoDate1 = this.date1Pictures[this.date1Pictures.length - 1];
        this.selectedDate1Picture = this.getLargePictureUrl(lastPhotoDate1);
        this.selectedDate1Thumbnail = lastPhotoDate1;
        this.selectedDate1 = this.parseDateFromTimestamp(lastPhotoDate1);
      }
      if (this.date2Pictures.length > 0) {
        const lastPhotoDate2 = this.date2Pictures[this.date2Pictures.length - 1];
        this.selectedDate2Picture = this.getLargePictureUrl(lastPhotoDate2);
        this.selectedDate2Thumbnail = lastPhotoDate2;
        this.selectedDate2 = this.parseDateFromTimestamp(lastPhotoDate2);
      }
    });
  }
  
  // Parse date from a timestamp format like "yyyyMMddHHmmss"
  parseDateFromTimestamp(timestamp: string): Date {
    const year = parseInt(timestamp.substring(0, 4), 10);
    const month = parseInt(timestamp.substring(4, 6), 10) - 1; // Month is zero-indexed
    const day = parseInt(timestamp.substring(6, 8), 10);
    return new Date(year, month, day);
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

  onDate1PictureSelect(picture: string): void {
    //this.loadingLeft = true;
    this.selectedDate1Picture = this.getLargePictureUrl(picture);
    this.selectedDate1Thumbnail = picture; // Highlight the selected thumbnail
  }

  onDate2PictureSelect(picture: string): void {
    //this.loadingRight = true;
    this.selectedDate2Picture = this.getLargePictureUrl(picture);
    this.selectedDate2Thumbnail = picture; // Highlight the selected thumbnail
  }

  onImageLoad(side: 'left' | 'right'): void {
    console.log(`Image on ${side} side loaded successfully`);
    if (side === 'left') {
      this.loadingLeft = false;
    } else {
      this.loadingRight = false;
    }
  }

  onImageError(side: 'left' | 'right'): void {
    console.error(`Failed to load image on ${side} side.`);
    if (side === 'left') {
      this.loadingLeft = false;
    } else {
      this.loadingRight = false;
    }
  }


  // Method to get large picture URL
  getLargePictureUrl(picture: string): string {
    //return `https://lslcloud.com/photos/${this.developerTag}/${this.projectTag}/${this.cameraName}/large/${picture}.jpg`;
    return `${this.path}/large/${picture}.jpg` ;
  }

  // Method to get thumbnail URL
  getThumbPictureUrl(picture: string): string {
    //return `https://lslcloud.com/photos/${this.developerTag}/${this.projectTag}/${this.cameraName}/thumbs/${picture}.jpg`;
    return `${this.path}/thumbs/${picture}.jpg` ;

  }


  onDate1Change(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = new Date(inputElement.value); // Parse the date
    const formattedDate = this.formatDate(selectedDate); // Format it for API call
    const otherDate = this.formatDate(this.selectedDate2); // Format the other date
    this.selectedDate1 = selectedDate; // Update bound Date object
    this.loadComparisonPhotos(formattedDate, otherDate); // Load photos
  }
  
  onDate2Change(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedDate = new Date(inputElement.value);
    const formattedDate = this.formatDate(selectedDate);
    const otherDate = this.formatDate(this.selectedDate1);
    this.selectedDate2 = selectedDate;
    this.loadComparisonPhotos(otherDate, formattedDate);
  }

  // Ensure `selectedDate1` and `selectedDate2` are in `yyyy-MM-dd` format for input binding
get date1InputValue(): string {
  return this.selectedDate1.toISOString().split('T')[0]; // Format for HTML input
}

get date2InputValue(): string {
  return this.selectedDate2.toISOString().split('T')[0];
}

formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

onThumbKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowRight' && this.sliderPosition < 100) {
    this.sliderPosition += 1; // Increment the slider position
    this.updateSlider();
  } else if (event.key === 'ArrowLeft' && this.sliderPosition > 0) {
    this.sliderPosition -= 1; // Decrement the slider position
    this.updateSlider();
  }
}

onThumbDragStart(event: MouseEvent): void {
  const trackElement = (event.target as HTMLElement).closest('.custom-slider')?.querySelector('.slider-track');

  if (!trackElement) {
    console.error('Slider track not found.');
    return;
  }

  const track = trackElement.getBoundingClientRect();

  const mouseMoveListener = (moveEvent: MouseEvent) => {
    const dragPosition = ((moveEvent.clientX - track.left) / track.width) * 100;
    this.sliderPosition = Math.min(Math.max(dragPosition, 0), 100); // Keep it between 0 and 100
    this.updateSlider();
  };

  const mouseUpListener = () => {
    window.removeEventListener('mousemove', mouseMoveListener);
    window.removeEventListener('mouseup', mouseUpListener);
  };

  window.addEventListener('mousemove', mouseMoveListener);
  window.addEventListener('mouseup', mouseUpListener);
}

  // Method to update slider overlay based on sliderPosition
  updateSlider(): void {
    const leftImg = document.querySelector('.left-img') as HTMLElement;
    const rightImg = document.querySelector('.right-img') as HTMLElement;
    leftImg.style.clipPath = `inset(0 ${100 - this.sliderPosition}% 0 0)`;
    rightImg.style.clipPath = `inset(0 0 0 ${this.sliderPosition}%)`;
    // if (leftImg && rightImg) {
    //   leftImg.style.width = `${this.sliderPosition}%`;
    //   rightImg.style.width = `${100 - this.sliderPosition}%`;
    // }
  }

}
