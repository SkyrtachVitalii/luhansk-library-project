export type UserRole = "user" | "manager" | "admin";
export type UserGender = "Чоловіча" | "Жіноча";

export interface IUser {
    _id?: string;
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

    createdAt?: Date;
    updatedAt?: Date;
}