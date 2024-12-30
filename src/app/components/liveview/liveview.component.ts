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
  private apiUrl = 'http://localhost:3000/proxy'; // Proxy endpoint

  constructor(private http: HttpClient) {}

  moveUp(): void {
    // Add logic to move the camera up
    this.controlPTZContinuous(0, 1, 0, 0, 50, 0); // Move up with tilt speed 50
  }
  
  moveDown(): void {
    // Add logic to move the camera down
    this.controlPTZContinuous(0, -1, 0, 0, 50, 0); // Move down with tilt speed 50
  }
  
  moveLeft(): void {
    // Add logic to move the camera left
    this.controlPTZContinuous(-1, 0, 0, 50, 0, 0); // Move left with pan speed 50
  }
  
  moveRight(): void {
    // Add logic to move the camera right
    this.controlPTZContinuous(1, 0, 0, 50, 0, 0); // Move right with pan speed 50
  }
  
  resetToStartPosition(): void {
    this.controlPTZAbsolute(0, 450, 100); // Reset to the start position
  }

  controlPTZAbsolute(a:number, b:number, c:number): void {

  }

  controlPTZContinuous(a:number, b:number, c:number, d:number, e:number, f:number): void {

  }
  
}
