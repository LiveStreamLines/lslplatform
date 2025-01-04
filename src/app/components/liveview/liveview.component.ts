import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-liveview',
  standalone: true,
  imports: [],
  templateUrl: './liveview.component.html',
  styleUrls: ['./liveview.component.css'],
})
export class LiveviewComponent {
  private apiUrl = 'http://5.9.85.250:3000/proxy';

  elevation = 0; // Starts at 0, range [0, 3600]
  azimuth = 90; // Starts at 90, range [0, 180]
  zoom = 1; // Starts at 1, range [0, 10]

  constructor(private http: HttpClient) {}

  moveLeft(): void {
    if (this.elevation > 0) {
      this.elevation -= 10; // Decrease by 10 (adjust increment as needed)
      this.updatePTZ();
    }
  }

  moveRight(): void {
    if (this.elevation < 3600) {
      this.elevation += 10; // Increase by 10
      this.updatePTZ();
    }
  }

  moveUp(): void {
    if (this.azimuth > 0) {
      this.azimuth -= 10; // Move closer to 0
      this.updatePTZ();
    }
  }

  moveDown(): void {
    if (this.azimuth < 180) {
      this.azimuth += 10; // Move closer to 180
      this.updatePTZ();
    }
  }

  zoomIn(): void {
    if (this.zoom < 10) {
      this.zoom += 1; // Increase zoom
      this.updatePTZ();
    }
  }

  zoomOut(): void {
    if (this.zoom > 0) {
      this.zoom -= 1; // Decrease zoom
      this.updatePTZ();
    }
  }

  resetToStartPosition(): void {
    this.elevation = 0;
    this.azimuth = 90;
    this.zoom = 1;
    this.updatePTZ();
  }

  updatePTZ(): void {
    const payload = {
      method: "PUT",
      url: "/ISAPI/PTZCtrl/channels/1/absolute",
      id: "bc07467acc1b4cd9bada264fab118e66",
      contentType: "application/xml",
      body: `<PTZData xmlns='http://www.isapi.org/ver20/XMLSchema' version='2.0'>
                <AbsoluteHigh>
                    <elevation>${this.elevation}</elevation>
                    <azimuth>${this.azimuth}</azimuth>
                    <absoluteZoom>${this.zoom}</absoluteZoom>
                </AbsoluteHigh>
             </PTZData>`,
    };

    this.http.post(`${this.apiUrl}/proxypass`, payload).subscribe({
      next: () => console.log('PTZ updated successfully'),
      error: (err) => console.error('Error updating PTZ:', err),
    });
  }
  
}
