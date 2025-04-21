import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { Observable, of, map } from 'rxjs';

// Services
import { MemoryService } from '../../services/memory.service';
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/users.service';


// Models
import { Memory } from '../../models/memory.model';
import { Developer } from '../../models/developer.model';
import { Project } from '../../models/project.model';
import { Camera } from '../../models/camera.model';
import { User } from '../../models/user.model';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-memories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.css']
})
export class MemoriesComponent implements OnInit {
  // Data Lists
  developers: Developer[] = [];
  projects: Project[] = [];
  memories: Memory[] = [];
  cameras: Camera[] = [];
  users: User[] = [];
  filteredMemories: Memory[] = [];     // Filtered subset for display

  // Selected Filters
  selectedDeveloperId: string | null = null;
  selectedProjectId: string | null = null;
  selectedCameraId: string | null = null;
  selectedUserId: string | null = null;
  
  statusFilter: string | null = null;
  statusOptions = [
    { value: null, viewValue: 'All Statuses' },
    { value: 'active', viewValue: 'Active' },
    { value: 'removed', viewValue: 'Removed' },
    { value: 'received', viewValue: 'Received' }
  ];

  // UI State
  isLoading = false;
  displayedColumns: string[] = [
    'developer',
    'project',
    'camera',
    'dateRange',
    'pictures',
    'memoryUsed',
    'memoryAvailable',
    'status',
    'removeDate',
    'receiveDate',
    'actions'
  ];

  constructor(
    private memoryService: MemoryService,
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private cameraService: CameraService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDevelopers();
    this.loadMemories();  // Load all memories upfront
    this.loadUsers();
  }

  
  loadMemories(): void {
    this.isLoading = true;
    this.memoryService.getMemories().subscribe({
      next: (data) => {
        console.log(data);
        this.memories = data.map(memory => ({
          ...memory,
        //  startDate: new Date(memory.startDate),
          endDate: new Date(memory.endDate),
          dateOfRemoval: memory.dateOfRemoval ? new Date(memory.dateOfRemoval) : null,
          dateOfReceive: memory.dateOfReceive ? new Date(memory.dateOfReceive) : null
        }));
        this.filterMemories();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadDevelopers(): void {
    this.developerService.getAllDevelopers().subscribe(developers => {
      this.developers = developers;
    });
  }

  loadProjects(developerId: string): void {
    if (developerId) {
      this.projectService.getProjectsByDeveloper(developerId).subscribe(projects => {
        this.projects = projects;
        this.selectedProjectId = null;
        this.cameras = [];
        this.selectedCameraId = null;
        this.filterMemories();
      });
    }
  }

  loadCameras(projectId: string): void {
    if (projectId) {
      this.cameraService.getCamerasByProject(projectId).subscribe(cameras => {
        this.cameras = cameras;
        this.selectedCameraId = null;
        this.filterMemories();
      });
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  filterMemories(): void {
    this.filteredMemories = this.memories.filter(memory => {
      const matchesDeveloper = !this.selectedDeveloperId || 
        memory.developer === this.selectedDeveloperId;
      const matchesProject = !this.selectedProjectId || 
        memory.project === this.selectedProjectId;
      const matchesCamera = !this.selectedCameraId || 
        memory.camera === this.selectedCameraId;
      const matchesStatus = !this.statusFilter || 
        memory.status === this.statusFilter;
      
      return matchesDeveloper && matchesProject && matchesCamera && matchesStatus;
    });
  }

   getDeveloperName(developerTag?: string): Observable<string> {
      if (!developerTag) return of ('Not assigned');
      return this.developerService.getDeveloperByTag2(developerTag).pipe(
        map(developer => developer?.developerName || 'Unkown')
      );    
    }

    getProjectName(projectTag?: string): Observable<string> {
      if (!projectTag) return of ('Not assigned');
      return this.projectService.getProjectByTag2(projectTag).pipe(
        map(project => project?.projectName || 'Unkown')
      );    
    }

  onDeveloperChange(): void {
    if (!this.selectedDeveloperId) {
      // "All Developers" selected
      this.projects = [];
      this.cameras = [];
      this.selectedProjectId = null;
      this.selectedCameraId = null;
    } else {
      this.loadProjects(this.selectedDeveloperId);
    }
    this.filterMemories();
  }

  onProjectChange(): void {
    if (!this.selectedProjectId) {
      // "All Projects" selected
      this.cameras = [];
      this.selectedCameraId = null;
    } else {
      this.loadCameras(this.selectedProjectId);
    }
    this.filterMemories();
  }

  onCameraChange(): void {
    this.filterMemories();
  }

  onUserChange(): void {
    this.filterMemories();
  }

  // Add status change handler
  onStatusChange(): void {
    this.filterMemories();
  }

  openAddMemory(): void {
    this.router.navigate(['/memory-form']);
  }

  openEditMemory(memoryId: string): void {
    this.router.navigate(['/memory-form', memoryId]);
  }

  updateMemoryStatus(memoryId: string, newStatus: 'removed' | 'received'): void {
    const update = {
      status: newStatus,
      ...(newStatus === 'removed' && { dateOfRemoval: new Date() }),
      ...(newStatus === 'received' && { dateOfReceive: new Date() })
    };
  
    this.memoryService.updateMemory(memoryId, update).subscribe({
      next: (updatedMemory) => {
        // Update local data
        const index = this.memories.findIndex(m => m._id === memoryId);
        if (index !== -1) {
          this.memories[index] = {
            ...this.memories[index],
            ...updatedMemory,
            dateOfRemoval: updatedMemory.dateOfRemoval ? new Date(updatedMemory.dateOfRemoval) : null,
            dateOfReceive: updatedMemory.dateOfReceive ? new Date(updatedMemory.dateOfReceive) : null
          };
          this.filterMemories();
        }
      },
      error: (err) => console.error('Error updating status:', err)
    });
  }
}