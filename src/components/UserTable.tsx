// components/UserTable.tsx
import React from 'react';
import { User } from '@/types/user';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: number) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
    if (users.length === 0) {
        return <p className="text-gray-500">Нет пользователей.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Роль</th>
                    <th className="p-3 text-left">Дата регистрации</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{user.id}</td>
                        <td className="p-3">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{user.email}</span>
                            </div>
                        </td>
                        <td className="p-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'tutor'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'student'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'tutor' && '👨‍🏫 Репетитор'}
                    {user.role === 'student' && '👨‍🎓 Студент'}
                    {user.role === 'parent' && '👨‍👩‍👧‍👦 Родитель'}
                </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}