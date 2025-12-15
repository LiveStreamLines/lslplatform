import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor and ngIf
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';  // Import the AuthService
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ManualVideoDialogComponent } from '../manual-video-dialog/manual-video-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environment/environments';

@Component({
  selector: 'app-header',
  standalone: true,
  imports:[
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    CommonModule, 
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;
  username: string | null = null;  // You can replace this with dynamic user data
  breadcrumbs: { label: string; url?: string }[] = [];
  isAdminOrSuperAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    const userRole = this.authService.getUserRole();
    this.isAdminOrSuperAdmin = userRole === 'Super Admin' || userRole === 'Admin';
    this.breadcrumbService.breadcrumbs$.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
      //console.log(this.breadcrumbs);
    });
  }

  openManual() {
     this.dialog.open(ManualVideoDialogComponent, {
       data: { title: 'Manual', videoUrl: 'assets/videos/manual.mp4' },
       panelClass: 'fullscreen-dialog', // Add a custom class for fullscreen styling
     });
   }

 
  // Toggle the sidenav
  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();  // Call the logout function in AuthService
  }

  triggerSync() {
    const authToken = this.authService.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': authToken ? `Bearer ${authToken}` : ''
    });

    const apiUrl = `${environment.backend}/api/sync/trigger`;

    this.http.post(apiUrl, {}, { headers }).subscribe({
      next: (response: any) => {
        const output = response.output || '';
        // Format the output: replace \n with line breaks, trim extra whitespace
        const formattedOutput = output
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .join('\n');
        
        const message = formattedOutput 
          ? `Sync successful:\n${formattedOutput}` 
          : 'Sync triggered successfully';
        
        this.snackBar.open(message, 'Close', {
          duration: 10000, // Longer duration to read the output
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        const errorMessage = error.error?.message || error.message || 'Failed to trigger sync';
        const errorOutput = error.error?.output || '';
        let fullErrorMessage = `Error: ${errorMessage}`;
        
        if (errorOutput) {
          const formattedOutput = errorOutput
            .split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0)
            .join('\n');
          fullErrorMessage = `${fullErrorMessage}\n${formattedOutput}`;
        }
        
        this.snackBar.open(fullErrorMessage, 'Close', {
          duration: 10000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
