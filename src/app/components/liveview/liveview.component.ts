import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environment/environments';


@Component({
  selector: 'app-liveview',
  standalone: true,
  imports: [],
  templateUrl: './liveview.component.html',
  styleUrls: ['./liveview.component.css'],
})
export class LiveviewComponent {
  private apiUrl = environment.proxy;
  iframeSrc: SafeResourceUrl = "";

  elevation = 0; // Starts at 0, range [0, 3600]
  azimuth = 0; // Starts at 90, range [0, 180]
  zoom = 0; // Starts at 1, range [0, 10]

  developerTag!: string;
  projectTag!: string;

  id: string = "";

  private projectTagMap: { [key: string]: string } = {
    stg: "3d24d5d6a0614efaa8c6f389ef5231e6",
    prime: "21d65e8a39414135a3a9b29b1a0471e2",
    gugg1: "f2148e9d059b4ba29cc75885c36e424f",
    puredc: "56f4ef2cd0b44e4eb83d8a0b3d5a10f6",
  };

  constructor(
    private http: HttpClient,     
    private route: ActivatedRoute, 
    private sanitizer: DomSanitizer
  ) {
    this.route.params.subscribe(params => {
      this.developerTag = params['developerTag'];
      this.projectTag = params['projectTag'];

      // Assign ID based on projectTag
      this.id = this.projectTagMap[this.projectTag] || "";
    });

    const safeurl =  `${environment.hik}/${this.projectTag}.html`;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(safeurl);
  }

  moveLeft(): void {
      this.azimuth -= 100; // Decrease by 10 (adjust increment as needed)
      this.updatePTZ();
  }

  moveRight(): void {
      this.azimuth += 100; // Increase by 10
      this.updatePTZ();
  }

  moveUp(): void {
    if (this.elevation > 0) {
      this.elevation -= 30; // Move closer to 0
      this.updatePTZ();
    }
  }

  moveDown(): void {
    if (this.elevation < 180) {
      this.elevation += 30; // Move closer to 180
      this.updatePTZ();
    }
  }

  zoomIn(): void {
    if (this.zoom < 100) {
      this.zoom += 10; // Increase zoom
      this.updatePTZ();
    }
  }

  zoomOut(): void {
    if (this.zoom > 0) {
      this.zoom -= 10; // Decrease zoom
      this.updatePTZ();
    }
  }

  resetToStartPosition(): void {
    this.elevation = 90;
    this.azimuth = 0;
    this.zoom = 0;
    this.updatePTZ();
  }

  updatePTZ(): void {
    const payload = {
      method: "PUT",
      url: "/ISAPI/PTZCtrl/channels/1/absolute",
      id: this.id,
      contentType: "application/xml",
      body: `<PTZData xmlns='http://www.isapi.org/ver20/XMLSchema' version='2.0'>
                <AbsoluteHigh>
                    <elevation>${this.elevation}</elevation>
                    <azimuth>${this.azimuth}</azimuth>
                    <absoluteZoom>${this.zoom}</absoluteZoom>
                </AbsoluteHigh>
             </PTZData>`,
    };

    this.http.post(`${this.apiUrl}`, payload).subscribe({
      next: () => console.log(`PTZ updated successfully. Ele:${this.elevation}, Azi:${this.azimuth}, zoom:${this.zoom}`),
      error: (err) => console.error('Error updating PTZ:', err),
    });
  }
  
}
