export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string; // Optional if passwords are not exposed
    phone: string;
    role: 'Super Admin' | 'Developer Admin' | 'User';
    accessibleDevelopers: string[]; // Array of developer IDs
    accessibleProjects: string[]; // Array of project IDs
    accessibleCameras: string[]; // Array of camera IDs
    token?: string; // Optional if token is not always present
    createdDate: string;
  }
  