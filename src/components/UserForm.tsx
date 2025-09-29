'use client';
import React, { useState, useEffect } from 'react';

interface UserFormProps {
    user?: any;
    onSubmit: (userData: any) => void;
    onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password_hash: '',
        role: 'student'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                password_hash: '', // Не предзаполняем пароль при редактировании
                role: user.role || 'student'
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация
        if (!formData.email) {
            alert('Email обязателен для заполнения');
            return;
        }

        if (!user && !formData.password_hash) {
            alert('Пароль обязателен при создании пользователя');
            return;
        }

        // Подготавливаем данные для отправки
        const submitData = user
            ? { email: formData.email, role: formData.role, ...(formData.password_hash && { password_hash: formData.password_hash }) }
            : formData;

        onSubmit(submitData);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
                {user ? 'Редактирование пользователя' : 'Создание нового пользователя'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="user@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {user ? 'Новый пароль (оставьте пустым, если не хотите менять)' : 'Пароль *'}
                    </label>
                    <input
                        type="password"
                        name="password_hash"
                        value={formData.password_hash}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={user ? "Новый пароль..." : "Введите пароль..."}
                        required={!user}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Роль *
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="student">👨‍🎓 Студент</option>
                        <option value="tutor">👨‍🏫 Репетитор</option>
                        <option value="parent">👨‍👩‍👧‍👦 Родитель</option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        {user ? 'Обновить' : 'Создать'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
}