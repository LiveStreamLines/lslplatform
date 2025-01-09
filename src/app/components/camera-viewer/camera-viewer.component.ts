import { Component, OnInit } from '@angular/core';
import { CameraService } from '../../services/camera.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/environments';

type GroupedCameras = {
  [developer: string]: {
    [project: string]: any[];
  };
};

@Component({
  selector: 'app-camera-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-viewer.component.html',
  styleUrl: './camera-viewer.component.css'
})
export class CameraViewerComponent implements OnInit {

  cameras: any[] = [];
  groupedCameras: GroupedCameras = {};

  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {
    this.cameraService.getLastPicture().subscribe((data) => {
      this.cameras = data;
      this.groupedCameras = this.groupByDeveloperAndProject(data);
    });
  }

  groupByDeveloperAndProject(cameras: any[]): any {
    return cameras.reduce((acc: GroupedCameras, camera) => {
      const developer = camera.developer;
      const project = camera.project;
      const cameraName = camera.cameraName;
      const serverFolder = camera.serverFolder;
      // Group by developer and project
      acc[developer] = acc[developer] || {};
      acc[developer][project] = acc[developer][project] || [];
      acc[developer][project].push(camera);
      return acc;
    }, {});
  }

  getImagePath(camera: any): string {
    const developer = camera.developer;
    const project = camera.project;
    const cameraName = camera.cameraName;
    const lastPhoto = camera.lastPhoto;
    return `${environment.backend}/media/upload/${developer}/${project}/${cameraName}/large/${lastPhoto}`;
  }

  isUpdated(lastPhoto: string): boolean {
    const timeDifference = (new Date().getTime() - new Date(lastPhoto).getTime()) / (1000 * 60);
    return timeDifference < 60; // Less than 1 hour
  }

  formatTimeDifference(lastPhoto: string): string {
    const timeDifference = Math.round((new Date().getTime() - new Date(lastPhoto).getTime()) / (1000 * 60));
    return timeDifference < 60 ? 'Updated' : `Not updated (${timeDifference} minutes ago)`;
  }


}
