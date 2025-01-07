import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-manual-video-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './manual-video-dialog.component.html',
  styleUrl: './manual-video-dialog.component.css'
})
export class ManualVideoDialogComponent {

  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; videoUrl: string }) {
    console.log('Received data:', data);
  }

  ngOnInit() {
    // This ensures the video is reset when the dialog opens
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.load(); // Reloads the video
    }
  }

}
