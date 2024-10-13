import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor and ngIf
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';  // Import the AuthService
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';  // Import Router and ActivatedRoute
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-header',
  standalone: true,
  imports:[
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    CommonModule, 
    RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() sidenav!: MatSidenav;
  username: string = 'Admin';  // You can replace this with dynamic user data
  breadcrumbs: string[] = [];


  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute  
  ) {}

  ngOnInit() {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

   // Update the breadcrumbs dynamically based on the current route
   updateBreadcrumbs() {
    const url = this.router.url;
    const urlSegments = url.split('/').filter(segment => segment);  // Split the URL and remove empty segments

    // Reset breadcrumbs to Main
    this.breadcrumbs = ['Main'];

    if (urlSegments.length > 1) {
      // Add developerTag if available
      this.breadcrumbs.push(urlSegments[1]);  // Assuming developerTag is in second position
    }

    if (urlSegments.length > 2) {
      // Add projectTag if available
      this.breadcrumbs.push(urlSegments[2]);  // Assuming projectTag is in third position
    }
  }

  // Toggle the sidenav
  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();  // Call the logout function in AuthService
  }
}
