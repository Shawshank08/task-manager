# Task Management System

This is a full-stack task management application built with:

- Node.js + Express (TypeScript)
- Prisma ORM (PostgreSQL)
- JWT authentication (Access + Refresh tokens)
- Next.js (App Router, TypeScript, Tailwind CSS)

## Features

- User registration & login
- Secure authentication using JWT
- Refresh token stored in httpOnly cookie
- Create, read, update, delete tasks
- Toggle task status (todo/done)
- Pagination
- Filter by status
- Search by title
- Dark minimal UI

## Authentication Design

Access tokens are short-lived and stored in memory.
Refresh tokens are stored in httpOnly cookies to prevent XSS attacks.

On page reload, the frontend automatically restores the session using the refresh endpoint.

## Challenges Faced

- Handling Prisma database connection issues (fixed using pooled connection)
- Implementing proper refresh-token flow
- Ensuring users cannot access or modify other users’ tasks
- Designing pagination and filtering efficiently

## How to Run

### Backend
# Task Management System

This is a full-stack task management application built with:

- Node.js + Express (TypeScript)
- Prisma ORM (PostgreSQL)
- JWT authentication (Access + Refresh tokens)
- Next.js (App Router, TypeScript, Tailwind CSS)

## Features

- User registration & login
- Secure authentication using JWT
- Refresh token stored in httpOnly cookie
- Create, read, update, delete tasks
- Toggle task status (todo/done)
- Pagination
- Filter by status
- Search by title
- Dark minimal UI

## Authentication Design

Access tokens are short-lived and stored in memory.
Refresh tokens are stored in httpOnly cookies to prevent XSS attacks.

On page reload, the frontend automatically restores the session using the refresh endpoint.

## Challenges Faced

- Handling Prisma database connection issues (fixed using pooled connection)
- Implementing proper refresh-token flow
- Ensuring users cannot access or modify other users’ tasks
- Designing pagination and filtering efficiently

## How to Run

### Backend
# Task Management System

This is a full-stack task management application built with:

- Node.js + Express (TypeScript)
- Prisma ORM (PostgreSQL)
- JWT authentication (Access + Refresh tokens)
- Next.js (App Router, TypeScript, Tailwind CSS)

## Features

- User registration & login
- Secure authentication using JWT
- Refresh token stored in httpOnly cookie
- Create, read, update, delete tasks
- Toggle task status (todo/done)
- Pagination
- Filter by status
- Search by title
- Dark minimal UI

## Authentication Design

Access tokens are short-lived and stored in memory.
Refresh tokens are stored in httpOnly cookies to prevent XSS attacks.

On page reload, the frontend automatically restores the session using the refresh endpoint.

## Challenges Faced

- Handling Prisma database connection issues (fixed using pooled connection)
- Implementing proper refresh-token flow
- Ensuring users cannot access or modify other users’ tasks
- Designing pagination and filtering efficiently

## How to Run

### Backend
npm install
npx prisma db push
npm run dev

### Frontend
npm install
npm run dev

Make sure to configure `.env` variables:
- DATABASE_URL
- ACCESS_SECRET
- REFRESH_SECRET