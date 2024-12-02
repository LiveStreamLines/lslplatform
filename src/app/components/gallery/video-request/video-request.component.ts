import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VideoRequestService } from '../../../services/video-request.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-video-request',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, // For mat-table
    MatPaginatorModule, // For mat-paginator
    MatSortModule, // For mat-sort
    MatProgressSpinnerModule, // For mat-spinner
    MatFormFieldModule, // For mat-form-field
    MatInputModule, // For matInput inside form fields
    MatIcon
  ],
  templateUrl: './video-request.component.html',
  styleUrls: ['./video-request.component.css'],
})
export class VideoRequestComponent implements OnInit {
  displayedColumns: string[] = [
    'developerProject',
    'duration',
    'hours',
    'RequestTime',
    'filteredImageCount',
    'status',
    'videoLink',
  ];
  dataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  errorMessage: string | null = null;
  serverUrl: string = "http://5.9.85.250:5000/media/upload";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private videoRequestService: VideoRequestService) {}

  ngOnInit(): void {
    this.fetchVideoRequests();
  }

  fetchVideoRequests(): void {
    this.isLoading = true;
    this.videoRequestService.getVideoRequests().subscribe({
      next: (data) => {
        this.dataSource.data = data.map((request) => ({
          developerProject: `${request.developer} (${request.project})`,
          duration: `${this.formatDate(request.startDate)} to ${this.formatDate(request.endDate)}`,
          //duration: `${request.startDate} to ${request.endDate}`,
          hours: `${request.startHour} to ${request.endHour}`,
          RequestTime: request.RequestTime,
          filteredImageCount: request.filteredImageCount,
          status: request.status,
          videoLink: request.status === 'ready' ? `${this.serverUrl}/${request.developerTag}/${request.projectTag}/${request.camera}/videos/video_${request.id}.mp4` : null, // Set to null initially
          resolution: request.resolution
        }));
        this.isLoading = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load video requests.';
        console.error(error);
        this.isLoading = false;
      },
    });
  }

  formatDate(date: string): string {
    // Extract year, month, and day from the YYYYMMDD format
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
  
    // Return formatted date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
