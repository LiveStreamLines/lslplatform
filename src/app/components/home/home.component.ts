import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor and ngIf
import { HeaderComponent } from '../header/header.component';  // Import HeaderComponent
import { SidenavComponent } from '../sidenav/sidenav.component';
import { DeveloperService } from '../../services/developer.service';
import { Developer } from '../../models//developer.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,SidenavComponent,CommonModule],  // Add the HeaderComponent to imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  developers: Developer[] = [];
  loading: boolean = true;

  constructor(
    private developerService: DeveloperService, 
    private router: Router) {}

  ngOnInit(): void {
    this.developerService.getAllDevelopers().subscribe({
      next: (data: Developer[]) => {
        // If the logo is a relative path, prepend the base URL
        this.developers = data.map(dev => ({
          ...dev,
          logo: `https://lslcloud.com/media/${dev.logo}`  // Prepend the base URL if needed
        }));
        this.loading = false;  // Stop loading when data is fetched
      },
      error: (err: any) => {
        console.error('Error fetching developers:', err);
        this.loading = false;  // Stop loading in case of error
      },
      complete: () => {
        console.log('Developer data loading complete.');
      }
    });
  }

  onDeveloperClick(developer: Developer): void {
    this.router.navigate(['/projects', developer._id]);  // Navigate to ProjectListComponent with developer ID
  }

}
