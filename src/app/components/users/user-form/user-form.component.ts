import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../services/users.service';
import { DeveloperService } from '../../../services/developer.service';
import { ProjectService } from '../../../services/project.service';
import { CameraService } from '../../../services/camera.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})

export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  isEditing: boolean = false;
  submitted: boolean = false;
  resetEmail: string = '';
  userId: string | null = null; // Store user ID when editing

  roles: string[] = ['Super Admin', 'Developer Admin', 'User'];
  developers: any[] = []; // Replace with actual developer data
  projects: any[] = []; // Replace with actual project data
  cameras: any[] = []; // Replace with actual camera data
  services: string[] = [
    'Timelapse',
    'Drone Shooting',
    'Site Photography',
    'Site Videography',
    '360 Photography',
    '360 Videography',
    'Satellite Imagery'
  ];

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private cameraService: CameraService,
    private route: ActivatedRoute,
    private router: Router) {}
  
  
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id'); // Get the user ID from the route
    this.isEditing = !!this.userId; // If there's an ID, it's edit mode
  
    this.initializeForm();

    // Load necessary data
    this.loadDevelopers();

    // Watch for changes in the role field
    this.userForm.get('role')?.valueChanges.subscribe((role: string) => {
      if (role === 'Super Admin') {
        this.clearAccessibles();
        this.clearPermissions();
      }
    });

     // Watch for changes in the developer field
     this.userForm.get('accessibleDevelopers')?.valueChanges.subscribe((developerIds: string[]) => {
      this.loadProjectsByDevelopers(developerIds);
    });

    // Watch for changes in the project field
    this.userForm.get('accessibleProjects')?.valueChanges.subscribe((projectIds: string[]) => {
      this.loadCamerasByProjects(projectIds);
    });
  }

  initializeForm(): void {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        role: ['', Validators.required],
        accessibleDevelopers: [[]],
        accessibleProjects: [[]],
        accessibleCameras: [[]],
        accessibleServices: [[]],
        canAddUser: [false],        // Permission to add user
        canGenerateVideoAndPics: [false],    // Permission to upload video
      }
    );
    if (this.isEditing) {
      this.loadUserData();
    }
  }

  loadDevelopers(): void {
    this.developerService.getAllDevelopers().subscribe({
      next: (developers) => (this.developers = developers),
      error: (error) => console.error('Error fetching developers:', error),
    });
  }

  loadProjectsByDevelopers(developerIds: string[]): void {
    this.projects = []; // Clear current projects
    if (developerIds && developerIds.length > 0) {
      developerIds.forEach((developerId) => {
        this.projectService.getProjectsByDeveloper(developerId).subscribe({
        next: (projects) => {
          this.projects = [...this.projects, ...projects];    // Merge new projects with the existing list       
        },
        error: (error) => console.error('Error fetching projects:', error),
       });
      });
    } else {
      this.projects = []; // Clear projects if no developer is selected
      this.userForm.get('accessibleProjects')?.setValue([]);
    }
  }

  loadCamerasByProjects(projectIds: string[]): void {
    this.cameras = []; // Clear current cameras
    if (projectIds && projectIds.length > 0) {
      projectIds.forEach((projectId) => {
        this.cameraService.getCamerasByProject(projectId).subscribe({
          next: (cameras) => {
            this.cameras = [...this.cameras, ...cameras]; // Merge new cameras with the existing list
          },
          error: (error) => console.error('Error fetching cameras:', error),
        });
      });
    } else {
      this.cameras = []; // Clear cameras if no project is selected
      this.userForm.get('accessibleCameras')?.setValue([]);
    }
  }

  loadUserData(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.userForm.patchValue(user);
        this.resetEmail = user.email;
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const userData = this.userForm.value;

    if (this.isEditing) {
      this.userService
        .updateUser(this.userId!, userData)
        .subscribe(() => {
          this.submitted = true;
          this.resetEmail = userData.email;
          console.log('User updated successfully');
        });
    } else {
      this.userService.addUser(userData).subscribe((response: any) => {
        this.submitted = true;
        this.userId = response._id; // Assuming the backend returns `user_id` in the response
        this.resetEmail = userData.email;
        console.log('User added successfully');
      });
    }
  }

  clearAccessibles(): void {
    // Clear accessible fields and their dependent dropdowns
    this.userForm.get('accessibleDevelopers')?.setValue([]);
    this.userForm.get('accessibleProjects')?.setValue([]);
    this.userForm.get('accessibleCameras')?.setValue([]);
    this.userForm.get('accessibleServices')?.setValue([]);
  }

  clearPermissions(): void {
    this.userForm.get('canAddUser')?.setValue(false);
    this.userForm.get('canGenerateVideoAndPics')?.setValue(false);
  }

  sendResetPasswordLink(): void {
    if (!this.resetEmail || !this.userId) {
      alert('Missing user ID or email address.');
      return;
    }

    this.userService.sendResetPasswordLink(this.userId, this.resetEmail).subscribe({
      next: () => alert('Reset password link sent successfully.'),
      error: () => alert('Failed to send reset password link.'),
    });
  }

  useCurrentPassword(): void {
    this.router.navigate(['/users']);
  }


}
