import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Maintenance } from '../../models/maintenance.model';
import { Camera } from '../../models/camera.model';
import { User } from '../../models/user.model';
import { Developer } from '../../models/developer.model';
import { Project } from '../../models/project.model';

interface DialogData {
  camera: Camera;
  users: User[];
  taskTypes: string[];
  taskType: string;
  taskDescription: string;
  assignedUser: string;
  developer: Developer;
  project: Project;
}

@Component({
  selector: 'app-task-creation-dialog',
  template: `
    <h2 mat-dialog-title>Create Maintenance Task</h2>
    <mat-dialog-content>
      <form #taskForm="ngForm">
        <div class="info-section">
          <div class="info-row">
            <mat-icon>business</mat-icon>
            <div class="info-content">
              <span class="info-label">Developer</span>
              <span class="info-value">{{data.developer.developerName}}</span>
              <span class="info-tag">{{data.developer.developerTag}}</span>
            </div>
          </div>
          <div class="info-row">
            <mat-icon>folder</mat-icon>
            <div class="info-content">
              <span class="info-label">Project</span>
              <span class="info-value">{{data.project.projectName}}</span>
              <span class="info-tag">{{data.project.projectTag}}</span>
            </div>
          </div>
          <div class="info-row">
            <mat-icon>videocam</mat-icon>
            <div class="info-content">
              <span class="info-label">Camera</span>
              <span class="info-value">{{data.camera.camera}}</span>
              <span class="info-tag" *ngIf="data.camera.cameraDescription">{{data.camera.cameraDescription}}</span>
            </div>
          </div>
        </div>

        <mat-form-field appearance="fill">
          <mat-label>Task Type</mat-label>
          <mat-select [(ngModel)]="data.taskType" name="taskType" required>
            <mat-option *ngFor="let type of data.taskTypes" [value]="type">{{type}}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Task Description</mat-label>
          <textarea matInput [(ngModel)]="data.taskDescription" name="taskDescription" required rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Assigned User</mat-label>
          <mat-select [(ngModel)]="data.assignedUser" name="assignedUser" required>
            <mat-option *ngFor="let user of data.users" [value]="user._id">
              {{user.name}} ({{user.role}})
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!taskForm.form.valid">
        Create Task
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .info-section {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px;
      background-color: white;
      border-radius: 4px;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-row mat-icon {
      margin-right: 12px;
      color: #666;
    }
    .info-content {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }
    .info-value {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    .info-tag {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TaskCreationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TaskCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.data.taskType && this.data.taskDescription && this.data.assignedUser) {
      const task: Maintenance = {
        taskType: this.data.taskType,
        taskDescription: this.data.taskDescription,
        assignedUser: this.data.assignedUser,
        status: 'pending',
        cameraId: this.data.camera._id,
        developerId: this.data.developer._id,
        projectId: this.data.project._id,
        dateOfRequest: new Date().toISOString(),
        userComment: '' // Initialize with empty string
      };
      this.dialogRef.close(task);
    }
  }
} 