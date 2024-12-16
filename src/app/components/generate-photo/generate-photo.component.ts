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
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    CommonModule,
    MatCheckboxModule
  ],
  templateUrl: './generate-photo.component.html',
  styleUrl: './generate-photo.component.css'
})
export class GeneratePhotoComponent implements OnInit {
  @Input() cameraName!: string; // Receiving cameraName from pare

  projectTag!: string;
  developerTag!: string;

  startDate!: string;
  endDate!: string;
  hour1: number = 8;
  hour2: number = 9;

  showDate: boolean = false;
  showTime: boolean = false;

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

    this.setDefaultDates();
  }

  private setDefaultDates(): void {
    const now = new Date(); // Current date
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of last month
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month
    this.startDate = this.formatDate(firstDayLastMonth);
    this.endDate = this.formatDate(lastDayLastMonth);
    console.log(this.startDate, this.endDate);

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
    return `${year}-${month}-${day}`;
  }

  
  formatDateForInput(dateString: string): string {
    return dateString.replace(/-/g, '');

  }

  filterImages() {
    this.isLoading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('developerId', this.developerTag);
    formData.append('projectId', this.projectTag);
    formData.append('cameraId', this.cameraName);
    formData.append('date1', this.formatDateForInput(this.startDate));
    formData.append('date2', this.formatDateForInput(this.endDate));
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

  preventManualInput(event: KeyboardEvent): void {
    // Allow only arrow keys, tab, backspace, and delete
    const allowedKeys = ['ArrowUp', 'ArrowDown', 'Tab', 'Backspace', 'Delete'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }  
  
  increment(fieldName: string): void {
    const field = (this as any)[fieldName];
    if (field !== undefined && field < 23) {
      (this as any)[fieldName] = field + 1;
    }
  }
  
  decrement(fieldName: string): void {
    const field = (this as any)[fieldName];
    if (field !== undefined && field > 0) {
      (this as any)[fieldName] = field - 1;
    }
  }

}
