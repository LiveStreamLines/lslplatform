import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngFor and ngIf
import { HeaderComponent } from './components/header/header.component';  // Import HeaderComponent
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';  // Import Angular Material Sidenav
import { MatListModule } from '@angular/material/list';  // Import Angular Material List
import { HeaderService } from './services/header.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidenavComponent,
    MatSidenavModule,
    MatListModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LSLplatform';

  constructor(public headerService: HeaderService) {}

}
