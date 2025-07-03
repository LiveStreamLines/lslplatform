import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CameraFeedComponent } from '../camera-feed/camera-feed.component';

@Component({
  selector: 'app-camera-feed-test',
  standalone: true,
  imports: [FormsModule, CameraFeedComponent],
  template: `
    <div style="padding: 20px; background: #f5f5f5; min-height: 100vh;">
      <h1>Camera Feed Test</h1>
      
      <div style="margin-bottom: 20px;">
        <label for="projectTag">Project Tag:</label>
        <select id="projectTag" [(ngModel)]="selectedProject" (change)="onProjectChange()" style="margin-left: 10px; padding: 5px;">
          <option value="">Select a project</option>
          <option value="gugg1">Guggenheim (gugg1)</option>
          <option value="stg">STG (stg)</option>
          <option value="prime">Prime (prime)</option>
          <option value="puredc">Pure DC (puredc)</option>
          <option value="proj">Project (proj)</option>
        </select>
      </div>

      <div style="margin-bottom: 20px;">
        <label for="cameraId">Camera ID:</label>
        <input id="cameraId" [(ngModel)]="cameraId" placeholder="main" style="margin-left: 10px; padding: 5px;">
      </div>

      <div style="margin-bottom: 20px;">
        <button (click)="refreshFeed()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Feed
        </button>
        <button (click)="clearConsole()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
          Clear Console
        </button>
      </div>

      <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3>Camera Feed</h3>
        <div style="width: 100%; height: 400px; border: 2px solid #ddd; border-radius: 4px; overflow: hidden;">
          <app-camera-feed 
            *ngIf="selectedProject" 
            [projectTag]="selectedProject" 
            [cameraId]="cameraId">
          </app-camera-feed>
          <div *ngIf="!selectedProject" style="display: flex; justify-content: center; align-items: center; height: 100%; color: #666;">
            Please select a project to view camera feed
          </div>
        </div>
      </div>

      <div style="margin-top: 20px; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3>Debug Information</h3>
        <div style="font-family: monospace; font-size: 12px; background: #f8f8f8; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto;">
          <div>Selected Project: {{ selectedProject || 'None' }}</div>
          <div>Camera ID: {{ cameraId || 'main' }}</div>
          <div>Current Time: {{ currentTime }}</div>
          <div>JSPlugin Available: {{ jsPluginAvailable }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CameraFeedTestComponent {
  selectedProject: string = '';
  cameraId: string = 'main';
  currentTime: string = '';
  jsPluginAvailable: boolean = false;

  constructor() {
    this.updateDebugInfo();
    setInterval(() => this.updateDebugInfo(), 1000);
  }

  onProjectChange(): void {
    console.log('Project changed to:', this.selectedProject);
  }

  refreshFeed(): void {
    console.log('Refreshing camera feed...');
    // Force component reload by temporarily clearing and resetting
    const temp = this.selectedProject;
    this.selectedProject = '';
    setTimeout(() => {
      this.selectedProject = temp;
    }, 100);
  }

  clearConsole(): void {
    console.clear();
    console.log('Console cleared');
  }

  private updateDebugInfo(): void {
    this.currentTime = new Date().toLocaleString();
    this.jsPluginAvailable = !!(window as any).JSPlugin;
  }
} 