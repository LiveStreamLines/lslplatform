import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor and ngIf
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PhotoService } from '../../services/photo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generate-photo',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './generate-photo.component.html',
  styleUrl: './generate-photo.component.css'
})
export class GeneratePhotoComponent implements OnInit {
  @Input() cameraName!: string; // Receiving cameraName from pare

  projectTag!: string;
  developerTag!: string;

  startDate!: Date;
  endDate!: Date;
  hour1: number = 8;
  hour2: number = 9;

  isLoading: boolean = false;
  errorMessage: string | null = null;
  filteredPicsCount!: number;
  isFilterComplete: boolean = false;

  constructor(
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.developerTag = this.route.snapshot.paramMap.get('developerTag')!;
    this.projectTag = this.route.snapshot.paramMap.get('projectTag')!;
  }

  onHour1Change(newHour: number): void {
    this.hour1 = newHour;
    this.adjustEndHour();
  }

  adjustEndHour(): void {
    this.hour2 = this.hour1 + 1;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}${month}${day}`;
  }

  filterImages() {
    this.isLoading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('developerId', this.developerTag);
    formData.append('projectId', this.projectTag);
    formData.append('cameraId', this.cameraName);
    formData.append('date1', this.formatDate(this.startDate));
    formData.append('date2', this.formatDate(this.endDate));
    formData.append('hour1', this.hour1.toString().padStart(2, '0'));
    formData.append('hour2', this.hour2.toString().padStart(2, '0'));

    this.photoService.generatePhoto(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.filteredPicsCount = response.filteredImageCount;
        this.isFilterComplete = true;
        this.snackBar.open('Photo request queued successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to generate photo request. Please try again.';
        console.error(error);
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
      },
    });
  }

}
