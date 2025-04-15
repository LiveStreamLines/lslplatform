import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { InventoryItem } from '../../models/inventory.model';
import { Assignment } from '../../models/inventory.model';
import { Developer } from '../../models/developer.model';
import { Project } from '../../models/project.model';
import { Camera } from '../../models/camera.model';
import { DeviceType } from '../../models/device-type.model';


import { AddDeviceDialogComponent } from './add-device-dialog/add-device-dialog.component';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { UnassignDialogComponent } from './unassign-dialog/unassign-dialog.component';
import { DeviceTypeListComponent } from './device-type-list/device-type-list.component';

import { InventoryService } from '../../services/inventory.service';
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { CameraService } from '../../services/camera.service';
import { DeviceTypeService } from '../../services/device-type.service';


import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  // Selected Filters
  selectedDeveloperId: string | null = null;
  selectedProjectId: string | null = null;
  selectedCameraId: string | null = null;
  selectedStatus: string | null = null;

  projectlist: Project[] = [];
  cameralist: Camera[] = [];

  developers: Developer[] = [];
  projects: Project[] = [];
  cameras: Camera[] = [];
  filteredItems: InventoryItem[] = [];
  
  inventoryItems: InventoryItem[] = [];
  displayedColumns: string[] = [
    'deviceType',
    'serialNumber',
    'status',
    'assignedTo',
    'age',
    'validity',
    'actions'
  ];

 // Add to your component class
  deviceTypes: DeviceType[] = [];
  validityDaysMap: { [key: string]: number } = {};

  newDevice = {
    type: '',
    serialNumber: ''
  };
  
  
  statusOptions = [
    { value: null, viewValue: 'All Statuses' },
    { value: 'available', viewValue: 'Available' },
    { value: 'assigned', viewValue: 'Assigned' },
    { value: 'retired', viewValue: 'Retired' }
  ];

  isLoading = false;


  constructor(
    private inventoryService: InventoryService,
    private developerService: DeveloperService,
    private projectService: ProjectService,
    private cameraService: CameraService,
    private deviceTypeService: DeviceTypeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDeviceTypes();
    this.loadInventory();
  }

  loadDeviceTypes(): void {
    this.deviceTypeService.getAll().subscribe(types => {
      this.deviceTypes = types;
      // Create validityDaysMap from loaded device types
      this.validityDaysMap = types.reduce((acc, type) => {
        acc[type.name] = type.validityDays;
        return acc;
      }, {} as { [key: string]: number });
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
        this.filterItems();
      });
    }
  }

  loadProjectlist(): void {
    //this.projectService
  }

  loadCameras(projectId: string): void {
    if (projectId) {
      this.cameraService.getCamerasByProject(projectId).subscribe(cameras => {
        this.cameras = cameras;
        this.selectedCameraId = null;
        this.filterItems();
      });
    }
  }

  filterItems(): void {
    this.filteredItems = this.inventoryItems.filter(item => {
      const matchesDeveloper = !this.selectedDeveloperId || 
        (item.currentAssignment && item.currentAssignment.developer === this.selectedDeveloperId);
      
      const matchesProject = !this.selectedProjectId || 
        (item.currentAssignment && item.currentAssignment.project=== this.selectedProjectId);
      
      const matchesCamera = !this.selectedCameraId || 
        (item.currentAssignment && item.currentAssignment.camera === this.selectedCameraId);
      
      const matchesStatus = !this.selectedStatus || 
        item.status === this.selectedStatus;
      
      return matchesDeveloper && matchesProject && matchesCamera && matchesStatus;
    });
  }

  onDeveloperChange(): void {
    if (!this.selectedDeveloperId) {
      this.projects = [];
      this.cameras = [];
      this.selectedProjectId = null;
      this.selectedCameraId = null;
    } else {
      this.loadProjects(this.selectedDeveloperId);
    }
    this.filterItems();
  }

  onProjectChange(): void {
    if (!this.selectedProjectId) {
      this.cameras = [];
      this.selectedCameraId = null;
    } else {
      this.loadCameras(this.selectedProjectId);
    }
    this.filterItems();
  }

  onCameraChange(): void {
    this.filterItems();
  }

  onStatusChange(): void {
    this.filterItems();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available': return 'primary';
      case 'assigned': return 'accent';
      case 'retired': return 'warn';
      case 'maintenance': return '';
      case 'expiring': return '';
      case 'expired': return 'warn';
      default: return '';
    }
  }
  
  loadInventory(): void {
    this.isLoading = true;
    this.inventoryService.getAll().subscribe({
      next: (items) => {
        this.inventoryItems = items.map(item => ({
          ...item,
          ageInDays: this.calculateAgeInDays(item),
          validityDays: this.getValidityDays(item.device.type)
        }));

        // Load developers first, then projects and cameras
        this.loadDevelopers();
        this.filterItems();
        this.isLoading = false;
      },
      error: () => this.isLoading = false      
    });
  }

  getDeveloperName(developerId?: string): Observable<string> {
    if (!developerId) return of ('Not assigned');
    return this.developerService.getDeveloperById2(developerId).pipe(
      map(developer => developer?.developerName || 'Unkown')
    );    
  }

  getProjectName(projectId?: string): Observable<string> {
    if (!projectId) return of('Not assigned');
    return this.projectService.getProjectById2(projectId).pipe(
      map(project => project?.projectName || 'Unknown')
    );
  }

  getCameraName(cameraId?: string): Observable<string> {
    if (!cameraId) return of('Not assigned');
    return this.cameraService.getCameraById2(cameraId).pipe(
      map(camera => camera?.cameraDescription || 'Unknown')
    );      
  }

  calculateAgeInDays(item: InventoryItem): number {
    // If no assignments at all, return 0
    if (!item.currentAssignment && (!item.assignmentHistory || item.assignmentHistory.length === 0)) {
      return 0;
    }
  
    let totalDays = 0;
  
    // Calculate duration for current assignment if exists
    if (item.currentAssignment) {
      const startDate = new Date(item.currentAssignment.assignedDate);
      const endDate = new Date(); // If still assigned, use today
      totalDays += Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
  
    // Calculate durations for all historical assignments
    if (item.assignmentHistory && item.assignmentHistory.length > 0) {
      item.assignmentHistory.forEach(assignment => {
        const startDate = new Date(assignment.assignedDate);
        const endDate = assignment.removedDate 
          ? new Date(assignment.removedDate) 
          : new Date(); // Shouldn't happen for historical assignments, but just in case
        totalDays += Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      });
    }
  
    return totalDays;
  }
  // Update getValidityDays to handle missing types
  getValidityDays(deviceType: string): number {
    return this.validityDaysMap[deviceType] || 365; // Default to 365 days if not found
  }

  getRemainingValidity(item: InventoryItem): number {
    return item.validityDays - item.ageInDays;
  }

  // <!-- Add this method to your component -->
      openDeviceTypesDialog(): void {
        this.dialog.open(DeviceTypeListComponent, {
          width: '800px',
          maxHeight: '90vh'
        });
      }


  // addDevice(): void {
  //   if (!this.newDevice.type || !this.newDevice.serialNumber) return;

  //   const newItem: Partial<InventoryItem> = {
  //     device: {
  //       type: this.newDevice.type,
  //       serialNumber: this.newDevice.serialNumber
  //     },
  //     status: 'available',
  //     validityDays: this.getValidityDays(this.newDevice.type),
  //     assignmentHistory: [],
  //     ageInDays: 0
  //   };

  //   this.inventoryService.create(newItem).subscribe(() => {
  //     this.loadInventory();
  //     this.newDevice = { type: '', serialNumber: '' };
  //   });
  // }
  
  // Add this method to open the dialog
  openAddDeviceDialog(): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createInventoryItem(result);
      }
    });
  }

  // Add this method to handle creation
  createInventoryItem(deviceData: any): void {
    const newItem : Partial<InventoryItem> = {
      device: {
        type: deviceData.type,
        serialNumber: deviceData.serialNumber,
        model: deviceData.model || undefined
      },
      status: 'available',
      assignmentHistory: [],
      validityDays: this.getValidityDays(deviceData.type)
    };

    this.inventoryService.create(newItem).subscribe({
      next: () => this.loadInventory(),
      error: (err) => console.error('Error creating item:', err)
    });
  }

  openAssignDialog(item: InventoryItem): void {
    const dialogRef = this.dialog.open(AssignDialogComponent, {
      width: '500px',
      data: { item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignDevice(item._id!, result);
      }
    });
  }

  assignDevice(itemId: string, assignment: Omit<Assignment, 'assignedDate'>): void {
    const completeAssignment: Assignment = {
      ...assignment,
      assignedDate: new Date()
    };

    this.inventoryService.assignItem(itemId, completeAssignment).subscribe(() => {
      this.loadInventory();
    });
  }

  openUnassignDialog(item: InventoryItem): void {
   const dialogRef = this.dialog.open(UnassignDialogComponent, {
     width: '400px',
     data: { item }
   });

   dialogRef.afterClosed().subscribe(result => {
     if (result) {
       this.unassignDevice(item._id!, result.reason);
     }
   });
  }

  unassignDevice(itemId: string, reason: string): void {
    this.inventoryService.unassignItem(itemId, reason).subscribe(() => {
      this.loadInventory();
    });
  }

  retireDevice(itemId: string): void {
    this.inventoryService.retireItem(itemId).subscribe(() => {
      this.loadInventory();
    });
  }
}