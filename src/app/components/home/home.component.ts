  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor and ngIf
  import { FormsModule } from '@angular/forms';  // Import FormsModule
  import { MatCardModule } from '@angular/material/card';
  import { MatButtonModule } from '@angular/material/button';
  import { DeveloperService } from '../../services/developer.service';
  import { Developer } from '../../models//developer.model';
  import { AuthService } from '../../services/auth.service';
  import { BreadcrumbService } from '../../services/breadcrumb.service';
  import { environment } from '../../../environment/environments';

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
    userRole: string | null = null;
    accessibleDevelopers: string[] = [];
    logopath: string =  environment.backend;

    constructor(
      private developerService: DeveloperService, 
      private breadcrumbService: BreadcrumbService,
      private authService: AuthService,
      private router: Router) {}

    ngOnInit(): void {
      this.userRole = this.authService.getUserRole();
      this.accessibleDevelopers = this.authService.getAccessibleDevelopers();

      this.developerService.getAllDevelopers().subscribe({
        next: (data: Developer[]) => {
          // If the logo is a relative path, prepend the base URL
          this.developers = data.map(dev => ({
            ...dev,
            logo: this.logopath + "/" + dev.logo  // Prepend the base URL if needed
          }));
          // Filter developers based on role and accessible developers
          this.filteredDevelopers = this.userRole === 'Super Admin'
          ? this.developers // Admins see all developers
          : this.developers.filter((dev) =>
              this.accessibleDevelopers.includes(dev._id)
            );
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

      this.breadcrumbService.setBreadcrumbs([
        { label: 'Home' },
      ]);

    }

    // This function will filter developers based on the search term
    filterDevelopers(): void {
      if (this.searchTerm) {
        this.filteredDevelopers = this.developers.filter(developer =>
          developer.developerName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        // Reset to the full filtered list based on role and accessible developers
        this.filteredDevelopers =
          this.userRole === 'Super Admin'
            ? this.developers
            : this.developers.filter((dev) =>
                this.accessibleDevelopers.includes(dev._id)
            );
      }
    }

    onDeveloperClick(developer: Developer): void {
      this.router.navigate(['/home', developer.developerTag]);  // Navigate to ProjectListComponent with developer ID
    }

  }
