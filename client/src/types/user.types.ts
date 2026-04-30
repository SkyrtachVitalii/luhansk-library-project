export type UserRole = "user" | "manager" | "admin";
export type UserGender = "Чоловіча" | "Жіноча";
import { JWTPayload } from "jose";

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
    email: string;
    phone: string;
    passwordHash: string;
    dateOfBirth: Date;
    gender: UserGender;
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

export interface SessionPayload extends JWTPayload {
  userId: string;
  role: UserRole; // Використовуємо конкретний тип ролі
  name: string;
}

export interface tableUserData {
  _id: string;
  email: string;
  name: string; // ПІБ
  role: string;
  createdAt: string;
  updatedAt: string;
}