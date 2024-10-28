import { Injectable } from '@angular/core';
import { CameraDetailService } from './camera-detail.service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CameraCompareSharedService {
  // Observable streams to be used in components
  private date1Pictures = new BehaviorSubject<string[]>([]);
  private date2Pictures = new BehaviorSubject<string[]>([]);

  date1Pictures$ = this.date1Pictures.asObservable();
  date2Pictures$ = this.date2Pictures.asObservable();
  
  constructor(private cameraDetailService: CameraDetailService) { }

    // Method to load pictures based on the project and camera details
   loadPictures(projectId: string, cameraName: string, date1?: string, date2?: string): void {
    this.cameraDetailService.getCameraDetails(projectId, cameraName, date1, date2).subscribe({
      next: (data) => {
        this.date1Pictures.next(data.date1Photos.map(photo => photo.toString()));
        this.date2Pictures.next(data.date2Photos.map(photo => photo.toString()));
      },
      error: (err) => {
        console.error('Error loading pictures:', err);
      }
    });
  }

}
