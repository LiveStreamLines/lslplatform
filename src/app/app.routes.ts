import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/auth.guard';  // Import the AuthGuard
import { ProjectListComponent } from './components/project-list/project-list.component';
import { CameraListComponent } from './components/camera-list/camera-list.component';
import { CameraDetailComponent } from './components/camera-detail/camera-detail.component';
import { CameraCompareComponent } from './components/camera-compare/camera-compare.component';
import { DevelopersComponent } from './components/developers/developers.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CameraComponent } from './components/cameras/cameras.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },  // Protect home with AuthGuard
  { path: 'main/:developerTag', component: ProjectListComponent },  // Project list for a specific developer
  { path: 'main/:developerTag/:projectTag', component: CameraListComponent },  // Camera list for a specific project
  { path: 'main/:developerTag/:projectTag/:cameraName', component: CameraDetailComponent },  // Route for camera detail
  { path: 'compare', component: CameraCompareComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'cameras', component: CameraComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];