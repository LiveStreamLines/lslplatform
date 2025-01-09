import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manual-video-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule, FormsModule, MatCheckboxModule],
  templateUrl: './manual-video-dialog.component.html',
  styleUrl: './manual-video-dialog.component.css'
})
export class ManualVideoDialogComponent {

  dontShowAgain = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; videoUrl: string },
  private dialogRef: MatDialogRef<ManualVideoDialogComponent>
) {
    console.log('Received data:', data);
  }

  ngOnInit() {
    // This ensures the video is reset when the dialog opens
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.load(); // Reloads the video
    }
  }

  closeDialog() {
    if (this.dontShowAgain) {
      // Save preference in local storage
      localStorage.setItem('dontShowManualDialog', 'true');
    }
    this.dialogRef.close();
  }

}
