export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string; // Optional if passwords are not exposed
    phone: string;
    role: 'Super Admin' | 'Admin' | 'User';
    accessibleDevelopers: string[]; // Array of developer IDs
    accessibleProjects: string[]; // Array of project IDs
    accessibleCameras: string[]; // Array of camera IDs
    token?: string; // Optional if token is not always present
    memoryRole?: 'tech' | 'memory-admin';
    inventoryRole?: 'tech' | 'invenotry-admin';
    createdDate: string;
    manual?: boolean;
    LastLoginTime?: string;
  }
  