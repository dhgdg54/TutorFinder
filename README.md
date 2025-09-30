 <div align="center">
  <img src="./public/images/logo.png" alt="TutorFinder Platform Logo" width="30%" />
</div>

<div align="center">
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)
  ![Prisma](https://img.shields.io/badge/Prisma-6.16.2-2D3748?logo=prisma)
  ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
  ![Статус](https://img.shields.io/badge/статус-активный-brightgreen)
  ![Версия](https://img.shields.io/badge/версия-1.0.0-blue)
  
</div>

# TutorFinder Platform

## 📋 Описание

TutorFinder Platform — это современное веб-приложение, которое соединяет студентов (и их родителей) с репетиторами. Платформа предоставляет репетиторам инструменты для создания профилей, управления расписанием и проведения занятий, а студентам — возможность находить подходящих преподавателей, бронировать уроки и отслеживать свой прогресс.

## 🛠️ Необходимые условия

Для работы с проектом потребуется:

- **Node.js 22.14 или новее**
- **npm / yarn / pnpm**
- **Docker и Docker Compose** (для базы данных)
- **Git** для управления версиями

## 📦 Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-username/tutorfinder-platform.git
cd tutorfinder-platform
```

### 2. Установка зависимостей
```bash
npm install
# или
yarn install
# или
pnpm install
```

### 3. Настройка окружения
Создайте файл `.env` в корневой директории:

```env
DATABASE_URL="mysql://myuser:mypassword@localhost:3306/myapp"
```

### 4. Запуск базы данных в Docker
```bash
docker-compose up -d
```

### 5. Настройка базы данных
```bash
# Генерация Prisma клиента
npx prisma generate

# Применение миграций
npx prisma db push
# или
npx prisma migrate dev
```

### 6. Запуск приложения
```bash
# Development режим
npm run dev
# или
yarn dev
# или
pnpm dev

# Production сборка
npm run build
npm start
```

> Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)  
> phpMyAdmin будет доступен по адресу: [http://localhost:8080](http://localhost:8080)

## 🐳 Docker Compose

Проект использует `Docker Compose` для запуска MySQL и phpMyAdmin:

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-dev
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: myapp
      MYSQL_USER: myuser
      MYSQL_PASSWORD: mypassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: phpmyadmin-dev
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      MYSQL_ROOT_PASSWORD: 123456
    ports:
      - "8080:80"
    depends_on:
      - mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

## 🚀 Скрипты

| Команда             | Назначение |
|---------------------|----------|
| `npm run dev`       | Запуск development сервера |
| `npm run build`     | Сборка production версии |
| `npm run start`     | Запуск production сервера |
| `npm run lint`      | Проверка кода с ESLint |

## 📞 Контакты

GitHub: [@dhgdg54](https://github.com/your-username)

<div align="center"> <sub>Создано для улучшения качества образования через технологии</sub> </div>
