// lib/api.ts
import axios from 'axios';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/user';

const api = axios.create({
    baseURL: '/api',
});

// Users API
export const usersApi = {
    // GET /api/users
    getAll: (): Axios.IPromise<User[]> =>
        api.get<User[]>('/users').then(response => response.data),

    // POST /api/users
    create: (userData: CreateUserRequest): Axios.IPromise<User> =>
        api.post<User>('/users', userData).then(response => response.data),

    // GET /api/users/{id}
    getById: (id: number): Axios.IPromise<User> =>
        api.get<User>(`/users/${id}`).then(response => response.data),

    // PUT /api/users/{id}
    update: (id: number, userData: UpdateUserRequest): Axios.IPromise<User> =>
        api.put<User>(`/users/${id}`, userData).then(response => response.data),

    // DELETE /api/users/{id}
    delete: (id: number): Axios.IPromise<User> =>
        api.delete<User>(`/users/${id}`).then(response => response.data)
};