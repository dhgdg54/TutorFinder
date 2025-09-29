// components/ApiTester.tsx
import React, {useState, useEffect, JSX} from 'react';
import { usersApi } from '@/lib/api';
import { User, UserRole, CreateUserRequest, UpdateUserRequest, ApiResponse } from '@/types/user';

interface ApiTesterProps {
    endpoint: string;
    selectedUser?: User | null;
    onClose: () => void;
    onResponse: (response: ApiResponse) => void;
}

interface FormData {
    email: string;
    password_hash: string;
    role: UserRole;
}

export default function ApiTester({ endpoint, selectedUser, onClose, onResponse }: ApiTesterProps) {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password_hash: '',
        role: UserRole.STUDENT
    });
    const [userId, setUserId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Сбрасываем форму при смене endpoint
        setFormData({
            email: '',
            password_hash: '',
            role: UserRole.STUDENT
        });
        setUserId('');

        // Предзаполняем данные для редактирования
        if (selectedUser && endpoint === 'PUT_USER') {
            setUserId(selectedUser.id.toString());
            setFormData({
                email: selectedUser.email,
                password_hash: '',
                role: selectedUser.role
            });
        }
    }, [endpoint, selectedUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const executeApiCall = async (): Promise<void> => {
        setLoading(true);
        try {
            let response: ApiResponse = { success: false };

            switch (endpoint) {
                case 'GET_USERS':
                    const users = await usersApi.getAll();
                    response = {
                        success: true,
                        data: users
                    };
                    break;

                case 'POST_USER':
                    const createData: CreateUserRequest = {
                        email: formData.email,
                        password_hash: formData.password_hash,
                        role: formData.role
                    };
                    const newUser = await usersApi.create(createData);
                    response = {
                        success: true,
                        data: newUser
                    };
                    break;

                case 'GET_USER':
                    if (!userId) {
                        onResponse({ success: false, error: 'ID пользователя обязателен' });
                        return;
                    }
                    const user = await usersApi.getById(parseInt(userId));
                    response = {
                        success: true,
                        data: user
                    };
                    break;

                case 'PUT_USER':
                    const putId = selectedUser ? selectedUser.id : parseInt(userId);
                    if (!putId) {
                        onResponse({ success: false, error: 'ID пользователя обязателен' });
                        return;
                    }
                    const updateData: UpdateUserRequest = {
                        email: formData.email,
                        ...(formData.password_hash && { password_hash: formData.password_hash }),
                        role: formData.role
                    };
                    const updatedUser = await usersApi.update(putId, updateData);
                    response = {
                        success: true,
                        data: updatedUser
                    };
                    break;

                case 'DELETE_USER':
                    const deleteId = selectedUser ? selectedUser.id : parseInt(userId);
                    if (!deleteId) {
                        onResponse({ success: false, error: 'ID пользователя обязателен' });
                        return;
                    }
                    const deletedUser = await usersApi.delete(deleteId);
                    response = {
                        success: true,
                        data: deletedUser
                    };
                    break;
            }

            onResponse(response);

        } catch (error: any) {
            const apiError: ApiResponse = {
                success: false,
                error: error.response?.data?.error || error.message || 'Произошла ошибка'
            };
            onResponse(apiError);
        } finally {
            setLoading(false);
        }
    };

    const renderForm = (): JSX.Element => {
        switch (endpoint) {
            case 'POST_USER':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="user@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Пароль *
                            </label>
                            <input
                                type="password"
                                name="password_hash"
                                value={formData.password_hash}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Введите пароль..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Роль
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={UserRole.STUDENT}>👨‍🎓 Студент</option>
                                <option value={UserRole.TUTOR}>👨‍🏫 Репетитор</option>
                                <option value={UserRole.PARENT}>👨‍👩‍👧‍👦 Родитель</option>
                            </select>
                        </div>
                    </div>
                );

            case 'GET_USER':
            case 'DELETE_USER':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID пользователя *
                        </label>
                        <input
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Введите ID пользователя"
                        />
                    </div>
                );

            case 'PUT_USER':
                return (
                    <div className="space-y-4">
                        {!selectedUser && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ID пользователя *
                                </label>
                                <input
                                    type="number"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Введите ID пользователя"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="user@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Новый пароль
                            </label>
                            <input
                                type="password"
                                name="password_hash"
                                value={formData.password_hash}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Оставьте пустым, если не меняется"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Роль
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={UserRole.STUDENT}>👨‍🎓 Студент</option>
                                <option value={UserRole.TUTOR}>👨‍🏫 Репетитор</option>
                                <option value={UserRole.PARENT}>👨‍👩‍👧‍👦 Родитель</option>
                            </select>
                        </div>
                    </div>
                );

            case 'GET_USERS':
                return <p className="text-gray-600">Нажмите Выполнить запрос для получения всех пользователей</p>;

            default:
                return <p className="text-gray-600">Интерфейс для этого endpoint не реализован</p>;
        }
    };

    const getEndpointTitle = (): string => {
        const titles: Record<string, string> = {
            'GET_USERS': 'Получить всех пользователей',
            'POST_USER': 'Создать пользователя',
            'GET_USER': 'Получить пользователя по ID',
            'PUT_USER': 'Обновить пользователя',
            'DELETE_USER': 'Удалить пользователя',
        };
        return titles[endpoint] || 'API Tester';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border-2 border-blue-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{getEndpointTitle()}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            {renderForm()}

            <div className="flex gap-3 mt-6">
                <button
                    onClick={executeApiCall}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    {loading ? 'Выполнение...' : 'Выполнить запрос'}
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Отмена
                </button>
            </div>
        </div>
    );
}