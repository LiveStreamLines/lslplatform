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
  zoom = 1; // Starts at 1, range [0, 10]

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
    this.getCurrentPTZ();
  }

  getCurrentPTZ(): void {
    const payload = {
      method: "GET",
      url: "/ISAPI/PTZCtrl/channels/1/absoluteEx",
      id: `${this.id}`,
      contentType: "application/xml"
    };

    this.http.post(`${this.apiUrl}`, payload).subscribe({
      next: (response: any) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        this.elevation = parseFloat(xmlDoc.getElementsByTagName("elevation")[0]?.textContent || "0");
        this.azimuth = parseFloat(xmlDoc.getElementsByTagName("azimuth")[0]?.textContent || "130.39");
        this.zoom = parseFloat(xmlDoc.getElementsByTagName("absoluteZoom")[0]?.textContent || "1");
        console.log(`Fetched PTZ: Ele:${this.elevation}, Azi:${this.azimuth}, Zoom:${this.zoom}`);
      },
      error: (err) => console.error("Error fetching PTZ:", err)
    });
  }
  moveLeft(): void {
    this.azimuth = Math.max(0, this.azimuth - 5); // Decrease within valid range
    this.updatePTZ();
  }

  moveRight(): void {
    this.azimuth = Math.min(360, this.azimuth + 5); // Increase within valid range
    this.updatePTZ();
  }

 moveUp(): void {
    this.elevation = Math.max(0, this.elevation - 5); // Move closer to 0 (up)
    this.updatePTZ();
  }

  moveDown(): void {
    this.elevation = Math.min(90, this.elevation + 5); // Move closer to 90 (down)
    this.updatePTZ();
  }

  zoomIn(): void {
    this.zoom = Math.min(25, this.zoom + 1); // Zoom-in up to max
    this.updatePTZ();
  }

  zoomOut(): void {
    this.zoom = Math.max(1, this.zoom - 1); // Zoom-out down to min
    this.updatePTZ();
  }

  resetToStartPosition(): void {
    this.elevation = 0;
    this.azimuth = 0;
    this.zoom = 1;
    this.updatePTZ();
  }

  updatePTZ(): void {
    const payload = {
      method: "PUT",
      url: "/ISAPI/PTZCtrl/channels/1/absoluteEx",
      id: `${this.id}`,
      contentType: "application/xml",
      body: `<PTZAbsoluteEx><elevation>${this.elevation.toFixed(2)}</elevation><azimuth>${this.azimuth.toFixed(2)}</azimuth><absoluteZoom>${this.zoom}</absoluteZoom><horizontalSpeed>5</horizontalSpeed><verticalSpeed>5</verticalSpeed></PTZAbsoluteEx>`,
    };

    this.http.post(`${this.apiUrl}`, payload).subscribe({
      next: () => console.log(`PTZ updated successfully. Project: ${this.projectTag} id: ${this.id} Url: ${this.apiUrl} Ele:${this.elevation}, Azi:${this.azimuth}, zoom:${this.zoom}`),
      error: (err) => console.error('Error updating PTZ:', err),
    });
  }
  
}
