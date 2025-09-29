// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {$Enums} from "@/generated/prisma";
import UserRole = $Enums.UserRole;

// GET /api/users — Получить всех пользователей
export async function GET() {
    try {
        const users = await prisma.user.findMany();
        console.log(users);
        return NextResponse.json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// POST /api/users — Создать нового пользователя
export async function POST(request: NextRequest) {
    try {
        console.log("123");
        const body = await request.json();
        console.log(body)
        const { email, password_hash, role } = body;

        if (!email || !password_hash) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Проверяем, существует ли уже пользователь с таким email
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password_hash,
                role: (role as UserRole) || UserRole.student,
            },
        });

        // Возвращаем пользователя без password_hash
        const { password_hash: _, ...userWithoutPassword } = newUser;
        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error('Failed to create user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}