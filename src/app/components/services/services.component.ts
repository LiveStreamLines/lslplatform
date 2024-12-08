import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatGridListModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  developerTag!: string;
  projectTag!: string;

  services = [
    { name: 'Timelapse', icon: 'timelapse', route: '/timelapse' },
    { name: 'Drone Shooting', icon: 'flight', route: '/drone-shooting' },
    { name: 'Site Photography', icon: 'camera_alt', route: '/site-photography' },
    { name: 'Site Videography', icon: 'videocam', route: '/site-videography' },
    { name: '360 Photography', icon: '360', route: '/360-photography' },
    { name: '360 Videography', icon: 'movie', route: '/360-videography' },
    { name: 'Satellite Imagery', icon: 'satellite', route: '/satellite-imagery' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    // Retrieve the route parameters
    this.route.params.subscribe(params => {
      this.developerTag = params['developerTag'];
      this.projectTag = params['projectTag'];
    });
  }

  

  navigateTo(serviceRoute: string) {

    // Navigate to the selected service, including developerTag and projectTag
    this.router.navigate([
      `main/services/${this.developerTag}/${this.projectTag}/${serviceRoute}`
    ]);

  }

}
