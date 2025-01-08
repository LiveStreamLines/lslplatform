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
import { CameraFormComponent } from './components/cameras/camera-form/camera-form.component'; // Adjust the path as necessary
import { GalleryComponent } from './components/gallery/gallery.component';
import { VideoRequestComponent } from './components/gallery/video-request/video-request.component';
import { PhotoRequestComponent } from './components/gallery/photo-request/photo-request.component';
import { MediaComponent } from './components/media/media.component';
import { ServicesComponent } from './components/services/services.component';
import { UsersComponent } from './components/users/users.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { ResetPasswordComponent } from './components/users/reset-password/reset-password.component';
import { LiveviewComponent } from './components/liveview/liveview.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { AboutUsComponent } from './components/about/about.component';
import { CameraViewComponent } from './components/camera-list/camera-view/camera-view.component';
import { CameraViewerComponent } from './components/camera-viewer/camera-viewer.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },  // Protect home with AuthGuard
  { path: 'home/:developerTag', component: ProjectListComponent,  canActivate: [AuthGuard] },  // Project list for a specific developer
  { path: 'home/:developerTag/:projectTag', component: ServicesComponent,  canActivate: [AuthGuard]},
  { path: 'home/:developerTag/:projectTag/timelapse', component: CameraListComponent, canActivate: [AuthGuard] },  // Camera list for a specific project
  { path: 'home/:developerTag/:projectTag/drone-shooting', component: ServiceDetailComponent, canActivate: [AuthGuard] },  // Camera list for a specific project
  { path: 'home/:developerTag/:projectTag/site-photography', component: ServiceDetailComponent, canActivate: [AuthGuard] },  // Camera list for a specific project
  { path: 'home/:developerTag/:projectTag/360-photography', component: ServiceDetailComponent, canActivate: [AuthGuard] },  // Camera list for a specific project
  { path: 'home/:developerTag/:projectTag/satellite-imagery', component: ServiceDetailComponent, canActivate: [AuthGuard] },  // Camera list for a specific project
  { path: 'home/:developerTag/:projectTag/:cameraName', component: CameraDetailComponent,  canActivate: [AuthGuard] },  // Route for camera detail
  { path: 'compare', component: CameraCompareComponent,  canActivate: [AuthGuard] },
  { path: 'developers', component: DevelopersComponent,  canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectsComponent,  canActivate: [AuthGuard] },
  { path: 'cameras', component: CameraComponent,  canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent,  canActivate: [AuthGuard] },
  { path: 'camera-form', component: CameraFormComponent,  canActivate: [AuthGuard] }, // Route for adding a new camera
  { path: 'camera-form/:id', component: CameraFormComponent,  canActivate: [AuthGuard] }, // Route for editing a camera by ID
  { path: 'users/add', component: UserFormComponent,  canActivate: [AuthGuard] },
  { path: 'users/edit/:id', component: UserFormComponent,  canActivate: [AuthGuard] }, // Route for editing
  { path: 'gallery', component: GalleryComponent,  canActivate: [AuthGuard]},
  { path: 'gallery/video-request', component: VideoRequestComponent,  canActivate: [AuthGuard]},
  { path: 'gallery/photo-request', component: PhotoRequestComponent,  canActivate: [AuthGuard]},
  { path: 'media', component: MediaComponent,  canActivate: [AuthGuard]},
  { path: 'liveview', component: LiveviewComponent, canActivate:[AuthGuard]},
  { path: 'about', component: AboutUsComponent, canActivate:[AuthGuard]},
  { path: 'monitor', component: CameraViewerComponent, canActivate:[AuthGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];