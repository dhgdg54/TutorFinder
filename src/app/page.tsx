// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import EndpointCard from "@/components/EndpointCard";
import UserTable from "@/components/UserTable";
import ApiTester from "@/components/ApiTester";
import { usersApi } from '@/lib/api';
import { User, ApiResponse } from '@/types/user';

type ActiveEndpoint =
    | 'GET_USERS'
    | 'POST_USER'
    | 'GET_USER'
    | 'PUT_USER'
    | 'DELETE_USER'
    | null;

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeEndpoint, setActiveEndpoint] = useState<ActiveEndpoint>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formError, setFormError] = useState<string>('');
    const [formSuccess, setFormSuccess] = useState<string>('');
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    const fetchUsers = async (): Promise<void> => {
        try {
            const data = await usersApi.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setFormError('Ошибка при загрузке пользователей');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: number): Promise<void> => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            return;
        }

        try {
            await usersApi.delete(userId);
            setFormSuccess('Пользователь успешно удален!');
            setActiveEndpoint(null);
            await fetchUsers();

            setTimeout(() => setFormSuccess(''), 3000);
        } catch (error: any) {
            setFormError(error.response?.data?.error || 'Ошибка при удалении пользователя');
        }
    };

    const handleEditUser = (user: User): void => {
        setSelectedUser(user);
        setActiveEndpoint('PUT_USER');
    };

    const handleEndpointClick = (endpoint: ActiveEndpoint): void => {
        setActiveEndpoint(endpoint);
        setFormError('');
        setApiResponse(null);
    };

    const handleCloseApiTester = (): void => {
        setActiveEndpoint(null);
        setSelectedUser(null);
        setApiResponse(null);
    };

    const handleApiResponse = (response: ApiResponse): void => {
        setApiResponse(response);
        if (response.success && (
            activeEndpoint === 'POST_USER' ||
            activeEndpoint === 'PUT_USER' ||
            activeEndpoint === 'DELETE_USER'
        )) {
            fetchUsers();
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">User Management Platform API</h1>

                {/* Уведомления */}
                {formError && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {formError}
                    </div>
                )}
                {formSuccess && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {formSuccess}
                    </div>
                )}

                {/* API Endpoints */}
                <div className="space-y-4 mb-8">
                    <EndpointCard
                        method="GET"
                        path="/api/users"
                        description="Получить всех пользователей"
                        onClick={() => handleEndpointClick('GET_USERS')}
                        isActive={activeEndpoint === 'GET_USERS'}
                    />
                    <EndpointCard
                        method="POST"
                        path="/api/users"
                        description="Создать нового пользователя"
                        onClick={() => handleEndpointClick('POST_USER')}
                        isActive={activeEndpoint === 'POST_USER'}
                    />
                    <EndpointCard
                        method="GET"
                        path="/api/users/{id}"
                        description="Получить пользователя по ID"
                        onClick={() => handleEndpointClick('GET_USER')}
                        isActive={activeEndpoint === 'GET_USER'}
                    />
                    <EndpointCard
                        method="PUT"
                        path="/api/users/{id}"
                        description="Обновить данные пользователя (частично)"
                        onClick={() => handleEndpointClick('PUT_USER')}
                        isActive={activeEndpoint === 'PUT_USER'}
                    />
                    <EndpointCard
                        method="DELETE"
                        path="/api/users/{id}"
                        description="Удалить пользователя по ID"
                        onClick={() => handleEndpointClick('DELETE_USER')}
                        isActive={activeEndpoint === 'DELETE_USER'}
                    />
                </div>

                {/* API Tester */}
                {activeEndpoint && (
                    <ApiTester
                        endpoint={activeEndpoint}
                        selectedUser={selectedUser}
                        onClose={handleCloseApiTester}
                        onResponse={handleApiResponse}
                    />
                )}

                {/* Таблица данных */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Текущие пользователи</h2>
                        <span className="text-sm text-gray-500">
                            Всего пользователей: {users.length}
                        </span>
                    </div>

                    <UserTable
                        users={users}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                    />
                </div>

                {/* Отображение ответа API */}
                {apiResponse && (
                    <div className="mt-6 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Ответ API:</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
                    </div>
                )}
            </div>
        </div>
    );
}