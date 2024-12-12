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
  breadcrumbs: { label: string; url: string }[] = [];

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
    let currentRoute = this.route.root;
    const breadcrumbs: { label: string; url: string }[] = [];
    let url = '';

    //console.log(currentRoute.snapshot);
     while (currentRoute.firstChild) {
       currentRoute = currentRoute.firstChild;
       
       // Process all segments in the current route
        currentRoute.snapshot.url.forEach(segment => {
          url += `/${segment.path}`; // Append each segment to the URL

          // Use the data['breadcrumb'] for the label if available, fallback to segment path
          const label = currentRoute.snapshot.data['breadcrumb'] || segment.path;

          breadcrumbs.push({ label, url });
        });
      //console.log(breadcrumbs);
      this.breadcrumbs = breadcrumbs;

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
