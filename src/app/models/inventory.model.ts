export interface Device {
    type: string;
    serialNumber: string;
    model?: string;
    purchaseDate?: Date;
  }
  
  export interface DeveloperReference {
    _id: string;
    name: string;
  }
  
  export interface ProjectReference {
    _id: string;
    name: string;
  }
  
  export interface CameraReference {
    _id: string;
    name: string;
  }
  
  export interface Assignment {
    developer: DeveloperReference;
    project: ProjectReference;
    camera?: CameraReference;
    assignedDate: Date;
    notes?: string;
  }
  
  export interface HistoricalAssignment extends Assignment {
    removedDate: Date;
    removalReason?: string;
  }
  
  export interface InventoryItem {
    _id?: string;
    device: Device;
    currentAssignment?: Assignment;
    assignmentHistory: HistoricalAssignment[];
    status: 'available' | 'assigned' | 'retired' | 'maintenance';
    ageInDays: number;
    validityDays: number;
    createdAt?: Date;
    updatedAt?: Date;
  }