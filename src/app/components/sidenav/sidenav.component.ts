import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, CommonModule],  // Add CommonModule here
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  isAdmin: boolean = true;  // You can set this dynamically later
}
