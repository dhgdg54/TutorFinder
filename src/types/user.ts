// types/user.ts
export interface User {
    id: number;
    email: string;
    password_hash?: string;
    role: UserRole;
    createdAt: string;
}

export enum UserRole {
    STUDENT = 'student',
    TUTOR = 'tutor',
    PARENT = 'parent'
}

export interface CreateUserRequest {
    email: string;
    password_hash: string;
    role?: UserRole;
}

export interface UpdateUserRequest {
    email?: string;
    password_hash?: string;
    role?: UserRole;
}

export interface ApiResponse<T = any> {
    success: boolean;
    status?: number;
    data?: T;
    error?: string;
}