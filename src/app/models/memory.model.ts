// memory.model.ts
export interface Memory {
  _id?: string; // Optional for new entries
  developer: {
    _id: string;
    developerName: string;
  };
  project: {
    _id: string;
    projectName: string;
  };
  camera: {
    _id: string;
    cameraName: string;
  };
  user: {
    _id: string;
    userName: string;
  };
  startDate: Date | string;
  endDate: Date | string;
  numberOfPics: number;
  dateOfRemoval?: Date | string | null;  // Allow null
  dateOfReceive?: Date | string | null;  // Allow null
  status: 'active' | 'removed' | 'received';
}