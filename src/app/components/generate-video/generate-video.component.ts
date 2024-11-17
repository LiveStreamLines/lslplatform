import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor and ngIf
import { VideoService } from '../../services/video.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-generate-video',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './generate-video.component.html',
  styleUrls: ['./generate-video.component.scss'],
})
export class GenerateVideoComponent implements OnInit {
  @Input() projectId!: string; // Receiving projectId from parent
  @Input() cameraName!: string; // Receiving cameraName from pare

  projectTag!: string;
  developerTag!: string;

  startDate!: Date;
  endDate!: Date;
  hour1: string = '08';
  hour2: string = '18';
  duration: number = 60;

  videoSrc: string | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  videoDetails: {
    message: string;
    videoPath: string;
    filteredImageCount: number;
    videoLength: string;
    fileSize: string;
    timeTaken: string;
  } | null = null;

  constructor(private videoService: VideoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.developerTag = this.route.snapshot.paramMap.get('developerTag')!;
    this.projectTag = this.route.snapshot.paramMap.get('projectTag')!;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}${month}${day}`;
  }


  onGenerateVideo() {
    this.isLoading = true;
    this.errorMessage = null;

    const payload = {
      developerId: this.developerTag,
      projectId: this.projectTag,
      cameraId: this.cameraName,
      date1: this.formatDate(this.startDate),
      date2: this.formatDate(this.endDate),
      hour1: this.hour1,
      hour2: this.hour2,
      duration: this.duration,
    };

    this.videoService.generateVideo(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.videoDetails = response;
        this.videoSrc = `http://5.9.85.250:5000${response.videoPath.replace('/var', '')}`;

        //this.videoSrc = `http://5.9.85.250:5000${response.videoPath}`;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to generate video. Please try again.';
        console.error(error);
      },
    });
  }
}
