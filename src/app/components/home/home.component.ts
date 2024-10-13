  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor and ngIf
  import { FormsModule } from '@angular/forms';  // Import FormsModule
  import { MatCardModule } from '@angular/material/card';
  import { MatButtonModule } from '@angular/material/button';
  import { DeveloperService } from '../../services/developer.service';
  import { Developer } from '../../models//developer.model';

  @Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule],  // Add the HeaderComponent to imports
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
  })

  export class HomeComponent implements OnInit {
    developers: Developer[] = [];
    loading: boolean = true;
    filteredDevelopers: Developer[] = [];  // To store filtered developers
    searchTerm: string = '';  // This will be used for filtering developers

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
          this.filteredDevelopers = this.developers;// Initialize filteredDevelopers with all developers
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

    // This function will filter developers based on the search term
    filterDevelopers(): void {
      if (this.searchTerm) {
        this.filteredDevelopers = this.developers.filter(developer =>
          developer.developerName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredDevelopers =  [...this.developers]; // Reset to original list if search is empty
      }
    }

    onDeveloperClick(developer: Developer): void {
      this.router.navigate(['/main', developer.developerTag]);  // Navigate to ProjectListComponent with developer ID
    }

  }
