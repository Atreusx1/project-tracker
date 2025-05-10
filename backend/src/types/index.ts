export interface User {
  _id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isEmailConfirmed: boolean;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}
export interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: string | User;
  createdAt: Date;
}

export interface WorkSession {
  _id: string;
  user: string | User;
  project: string | Project;
  description?: string;
  startTime: Date;
  endTime?: Date;
}
