import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/users.service';
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { CameraService } from '../../services/camera.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  users : User[] = [];
  filteredUsers: User[] = [];
  developers: any[] = [];
  projects: any[] = [];
  cameras: any[] = [];
  selectedRole: string = '';
  selectedDeveloperId: string | null = null;
  selectedProjectId: string | null = null;
  selectedCameraId: string | null = null;
  isLoading : boolean = true;

 constructor(
  private userService: UserService, 
  private router: Router,
  private developerService: DeveloperService,
  private projectService: ProjectService,
  private cameraService: CameraService
 ) {} // Inject UserService

  ngOnInit(): void {
    this.fetchUsers();
    this.loadDevelopers();
  }

  // Fetch users from the service
  fetchUsers(): void {
    this.isLoading = true; // Set loading to true
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users]; // Initialize filtered users
        this.isLoading = false; // Loading complete
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.isLoading = false; // Stop loading on error
      },
    });
  }

  loadDevelopers(): void {
    this.isLoading = true;
    this.developerService.getAllDevelopers().subscribe((developers) => {
      this.developers = [{ _id: 'ALL', developerName: 'All Developers' }, ...developers];
      this.isLoading = false;
      this.selectedDeveloperId = 'ALL';
      this.loadProjects();
    });
  }

  loadProjects(): void {
    if (this.selectedDeveloperId && this.selectedDeveloperId !== 'ALL') {
      this.isLoading = true;
      this.projectService.getProjectsByDeveloper(this.selectedDeveloperId).subscribe((projects) => {
        this.projects = [{ _id: 'ALL', projectName: 'All Projects' }, ...projects];
        this.isLoading = false;
        this.loadCameras();
      });
    } else {
      this.projects = [];
      this.cameras = [];
      this.selectedProjectId = 'ALL';
      this.selectedCameraId = 'ALL';
      this.filterUsersByAccess();
    }
  }

  loadCameras(): void {
    if (this.selectedProjectId && this.selectedProjectId !== 'ALL') {
      this.isLoading = true;
      this.cameraService.getCamerasByProject(this.selectedProjectId).subscribe((cameras) => {
        this.cameras = [{ _id: 'ALL', cameraDescription: 'All Cameras' }, ...cameras];
        this.isLoading = false;
        this.filterUsersByAccess();
      });
    } else {
      this.cameras = [];
      this.selectedCameraId = 'ALL';
      this.filterUsersByAccess();
    }
  }

  onDeveloperChange(): void {
    this.selectedProjectId = 'ALL';
    this.selectedCameraId = 'ALL';
    this.projects = [];
    this.cameras = [];
    this.loadProjects();
  }

  onProjectChange(): void {
    this.selectedCameraId = 'ALL';
    this.cameras = [];
    this.loadCameras();
  }

  filterUsersByAccess(): void {
    this.filteredUsers = this.users.filter((user) => {
      const isAdmin = user.role === 'Super Admin';
      const matchesDeveloper =
        this.selectedDeveloperId === 'ALL' || user.accessibleDevelopers.includes(this.selectedDeveloperId!);
      const matchesProject =
        this.selectedProjectId === 'ALL' || user.accessibleProjects.includes(this.selectedProjectId!);
      const matchesCamera =
        this.selectedCameraId === 'ALL' || user.accessibleCameras.includes(this.selectedCameraId!);

      return isAdmin || (matchesDeveloper && matchesProject && matchesCamera);
    });
  }

  onRoleChange(): void {
    this.filteredUsers = this.selectedRole
      ? this.users.filter(user => user.role === this.selectedRole)
      : [...this.users];
  }

  openAddUser(): void {
    this.router.navigate(['/users/add']);
  }

  openEditUser(userId: string): void {
    this.router.navigate(['/users/edit', userId]);
  }

  deleteUser(userId: number): void {
    console.log('Delete User:', userId);
  }

}
