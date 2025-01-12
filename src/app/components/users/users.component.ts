import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator'; // Import MatPaginator
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
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginator,
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
  userRole: string | null = null;
  accessibleDeveloper: string[]=[];
  accessibleProject: string[]=[];
  accessibleCamera: string[]=[];
  isSuperAdmin: boolean = false;
  users : User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = []; // Users to display on the current page
  pageSize: number = 5; // Default number of rows per page
  pageIndex: number = 0; // Current page index
  developers: any[] = [];
  projects: any[] = [];
  cameras: any[] = [];
  selectedRole: string = '';
  selectedDeveloperId: string | null = null;
  selectedProjectId: string | null = null;
  selectedCameraId: string | null = null;
  searchTerm: string = ''; // To hold the search term
  isLoading : boolean = true;

 constructor(
  private userService: UserService, 
  private router: Router,
  private developerService: DeveloperService,
  private projectService: ProjectService,
  private cameraService: CameraService,
  private authService: AuthService
 ) {} // Inject UserService

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.getUserRole() === 'Super Admin';
    this.accessibleDeveloper = this.authService.getAccessibleDevelopers()!;
    this.accessibleProject = this.authService.getAccessibleProjects();
    this.accessibleCamera = this.authService.getAccessibleCameras();
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
        this.updatePaginatedUsers();
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
      if (this.isSuperAdmin || this.accessibleDeveloper[0] === 'all') {
        // Super admins see all developers including "All Developers"
        this.developers = [{ _id: 'ALL', developerName: 'All Developers' }, ...developers];
      } else {
        // Non-super admins see only their accessible developers
        this.developers = developers.filter((developer) =>
          this.accessibleDeveloper.includes(developer._id)
        );
      }

      this.isLoading = false;
      this.selectedDeveloperId = this.developers.length ? this.developers[0]._id : null;
      this.filterUsersByAccess();
      this.loadProjects();
    });
  }

  loadProjects(): void {
    if (this.selectedDeveloperId && this.selectedDeveloperId !== 'ALL') {
      this.isLoading = true;
      this.projectService.getProjectsByDeveloper(this.selectedDeveloperId).subscribe((projects) => {
        if (this.isSuperAdmin || this.accessibleProject[0] === 'all') {
          this.projects = [{ _id: 'ALL', projectName: 'All Projects' }, ...projects];
         } else {
          // Non-super admins see only their accessible developers
         this.projects = projects.filter((project) =>
            this.accessibleProject.includes(project._id)
          );
        }
        this.isLoading = false;
        this.selectedProjectId = this.projects.length ? this.projects[0]._id : null;
        this.filterUsersByAccess();
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
        if (this.isSuperAdmin || this.accessibleCamera[0] === 'all') {
          this.cameras = [{ _id: 'ALL', cameraDescription: 'All Cameras' }, ...cameras];
        } else {
           // Non-super admins see only their accessible developers
          this.cameras = cameras.filter((camera) =>
            this.accessibleCamera.includes(camera._id)
          );
        }
        this.isLoading = false;
        this.selectedCameraId = this.cameras.length ? this.cameras[0]._id : null;
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

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }


  filterUsersByAccess(): void {
    this.filteredUsers = this.users.filter((user) => {
      const isAdmin = user.role === 'Super Admin';
      const matchesDeveloper =
        this.selectedDeveloperId === 'ALL' 
        || user.accessibleDevelopers.includes(this.selectedDeveloperId!)
        || user.accessibleDevelopers[0] === 'all';
      const matchesProject =
        this.selectedProjectId === 'ALL' 
        || user.accessibleProjects.includes(this.selectedProjectId!)
        || user.accessibleProjects[0] === 'all'; // Include users with "all"
      const matchesCamera =
        this.selectedCameraId === 'ALL' 
        || user.accessibleCameras.includes(this.selectedCameraId!)
        || user.accessibleCameras[0] === 'all';

      if (this.isSuperAdmin || this.accessibleDeveloper[0] === "all") {
        return isAdmin || (matchesDeveloper && matchesProject && matchesCamera);
      } else {
        return (matchesDeveloper && matchesProject && matchesCamera);
      }
    });
    this.updatePaginatedUsers(); // Update paginated users after filtering
  }

  onRoleChange(): void {
    this.filteredUsers = this.selectedRole
      ? this.users.filter(user => user.role === this.selectedRole)
      : [...this.users];
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      // Reset filters to "All" when a search is initiated
      this.selectedDeveloperId = 'ALL';
      this.selectedProjectId = 'ALL';
      this.selectedCameraId = 'ALL';
  
      // Filter users based on the search term
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // If search term is empty, apply filters
      this.filterUsersByAccess();
    }
    this.pageIndex = 0; // Reset to the first page
    this.updatePaginatedUsers();
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
