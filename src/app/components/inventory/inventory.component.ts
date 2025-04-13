import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { InventoryService } from '../../services/inventory.service';
import { AssignDialogComponent } from '../assign-dialog/assign-dialog.component';
import { UnassignDialogComponent } from '../unassign-dialog/unassign-dialog.component';
import { InventoryItem } from '../../models/inventory.model';
import { Assignment } from '../../models/inventory.model';
import { Developer } from '../../models/developer.model';
import { Project } from '../../models/project.model';
import { Camera } from '../../models/camera.model';
import { AddDeviceDialogComponent } from './add-device-dialog/add-device-dialog.component';
import { DeveloperService } from '../../services/developer.service';
import { ProjectService } from '../../services/project.service';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
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

  deviceTypes = [
    'Box',
    'Pi',
    'Battery',
    'Charge Controller',
    'Dongle',
    'Enclosure',
    'Camera',
    'Lens',
    'SIM Card'
  ];

  validityDaysMap: { [key: string]: number } = {
    'Box': 365,
    'Pi': 730,
    'Battery': 365,
    'Charge Controller': 730,
    'Dongle': 365,
    'Enclosure': 1095,
    'Camera': 730,
    'Lens': 1095,
    'SIM Card': 365
  };

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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadInventory();
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
        (item.currentAssignment && item.currentAssignment.developer._id === this.selectedDeveloperId);
      
      const matchesProject = !this.selectedProjectId || 
        (item.currentAssignment && item.currentAssignment.project._id === this.selectedProjectId);
      
      const matchesCamera = !this.selectedCameraId || 
        (item.currentAssignment && item.currentAssignment.camera?._id === this.selectedCameraId);
      
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
        this.filterItems();
        this.isLoading = false;
      },
      error: () => this.isLoading = false      
    });
  }

  calculateAgeInDays(item: InventoryItem): number {
    if (!item.currentAssignment?.assignedDate) return 0;
    const assignedDate = new Date(item.currentAssignment.assignedDate);
    const today = new Date();
    return Math.floor((today.getTime() - assignedDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  getValidityDays(deviceType: string): number {
    return this.validityDaysMap[deviceType] || 365;
  }

  getRemainingValidity(item: InventoryItem): number {
    return item.validityDays - item.ageInDays;
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