import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from '../../../services/users.service';
import { DeveloperService } from '../../../services/developer.service';
import { ProjectService } from '../../../services/project.service';
import { CameraService } from '../../../services/camera.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatButtonModule, ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})

export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  isEditing: boolean = false;
  developers: any[] = []; // Replace with actual developer data
  projects: any[] = []; // Replace with actual project data
  cameras: any[] = []; // Replace with actual camera data
  userId: string | null = null; // Store user ID when editing

  constructor(private fb: FormBuilder, private userService: UserService, 
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private cameraService: CameraService,
    private route: ActivatedRoute,
    private router: Router) {}
  
  // Validator function for password match
  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const retypePassword = control.get('retypePassword')?.value;

      if (password && retypePassword && password !== retypePassword) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id'); // Get the user ID from the route
    this.isEditing = !!this.userId; // If there's an ID, it's edit mode
  
    this.initializeForm();

    // Load necessary data
    this.loadDevelopers();

    // Watch for changes in the role field
    this.userForm.get('role')?.valueChanges.subscribe((role: string) => {
      if (role === 'Admin') {
        this.clearAccessibles();
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
        password: ['', Validators.required],
        retypePassword: ['', Validators.required],
        phone: ['', Validators.required],
        role: ['', Validators.required],
        accessibleDevelopers: [[]],
        accessibleProjects: [[]],
        accessibleCameras: [[]],
      },
      { validators: this.passwordsMatchValidator() } // Attach validator here
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
        this.userForm.get('retypePassword')?.setValue(user.password);
      });
    }
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.userService
        .updateUser(this.userId!, this.userForm.value)
        .subscribe(() => {
          console.log('User updated successfully');
          this.router.navigate(['/users']); // Navigate back to the user list
        });
    } else {
      this.userService.addUser(this.userForm.value).subscribe(() => {
        console.log('User added successfully');
        this.router.navigate(['/users']); // Navigate back to the user list
      });
    }
  }


  clearAccessibles(): void {
    // Clear accessible fields and their dependent dropdowns
    this.userForm.get('accessibleDevelopers')?.setValue([]);
    this.userForm.get('accessibleProjects')?.setValue([]);
    this.userForm.get('accessibleCameras')?.setValue([]);
  }

}
