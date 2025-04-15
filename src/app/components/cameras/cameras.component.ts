import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { CameraService } from '../../services/camera.service';
import { Developer } from '../../models/developer.model';
import { Project } from '../../models/project.model';
import { Camera } from '../../models/camera.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CameraComponent implements OnInit {
  developers: Developer[] = [];
  projects: Project[] = [];
  cameras: Camera[] = [];
  selectedDeveloperId: string | null = null;
  selectedProjectId: string | null = null;
  isLoading = false;

  constructor(
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private router: Router, 
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {
    this.loadDevelopers();
  }

  loadDevelopers(): void {
    this.isLoading = true;
    this.developerService.getAllDevelopers().subscribe((data) => {
      this.developers = data;
      this.isLoading = false;
      if (this.developers.length) {
        this.selectedDeveloperId = this.developers[0]._id; // Default to first developer
        this.loadProjects();
      }
    });
  }

  loadProjects(): void {
    if (this.selectedDeveloperId) {
      this.isLoading = true;
      this.projectService.getProjectsByDeveloper(this.selectedDeveloperId).subscribe((data) => {
        this.projects = data;
        this.isLoading = false;
        if (this.projects.length) {
          this.selectedProjectId = this.projects[0]._id; // Default to first project
          this.loadCameras();
        }
      });
    }
  }

  loadCameras(): void {
    if (this.selectedProjectId) {
      this.isLoading = true;
      this.cameraService.getCamerasByProject(this.selectedProjectId).subscribe((data) => {
        this.cameras = data;
        this.isLoading = false;
      });
    }
  }

  onDeveloperChange(): void {
    this.selectedProjectId = null;
    this.projects = [];
    this.cameras = [];
    this.loadProjects();
  }

  onProjectChange(): void {
    this.cameras = [];
    this.loadCameras();
  }

  openEditCamera(cameraId: string) {
    this.router.navigate(['/camera-form', cameraId]);
  }

  openAddCamera(){
    this.router.navigate(['/camera-form',{ developerId: this.selectedDeveloperId, projectId: this.selectedProjectId }]);
  }


  downloadConfig(camera: Camera): void {
    const developer = this.developers.find(dev => dev._id === camera.developer);
    const project = this.projects.find(proj=> proj._id === camera.project);

    const configData = [
      {
        server: "tempcloud",
        folder: "/home/lsl/media/lslcloud1",
        country: "",
        developer: developer?.developerTag,
        project: project?.projectTag,
        camera: camera.camera
      }
    ];

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'configure.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }
}
