import { Document } from 'mongoose';

export type UserRole = 'user' | 'manager' | 'admin';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  patronymic?: string;
  email: string;
  phone: string;
  passwordHash: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  address: string;
  education?: string;
  activitiField?: string;
  workplace?: string;
  addictionalInfo?: string;
  gdprConsent: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
