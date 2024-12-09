import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/users.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatButtonModule],
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

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.initializeForm();

    // Load necessary data
    this.loadDevelopers();
    this.loadProjects();
    this.loadCameras();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['', Validators.required],
      accessibleDevelopers: [[]],
      accessibleProjects: [[]],
      accessibleCameras: [[]],
    });

    if (this.isEditing) {
      this.loadUserData();
    }
  }

  loadDevelopers(): void {
    // Replace with service call to load developers
    this.developers = [
      { _id: 'dev1', name: 'Developer 1' },
      { _id: 'dev2', name: 'Developer 2' },
    ];
  }

  loadProjects(): void {
    // Replace with service call to load projects
    this.projects = [
      { _id: 'proj1', name: 'Project 1' },
      { _id: 'proj2', name: 'Project 2' },
    ];
  }

  loadCameras(): void {
    // Replace with service call to load cameras
    this.cameras = [
      { _id: 'cam1', name: 'Camera 1' },
      { _id: 'cam2', name: 'Camera 2' },
    ];
  }

  loadUserData(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.userForm.patchValue(user);
        // Disable password field when editing
        this.userForm.get('password')?.disable();
      });
    }
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.userService
        .updateUser(this.userId!, this.userForm.value)
        .subscribe(() => {
          console.log('User updated successfully');
        });
    } else {
      this.userService.addUser(this.userForm.value).subscribe(() => {
        console.log('User added successfully');
      });
    }
  }

}
