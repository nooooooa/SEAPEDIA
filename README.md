# SEAPEDIA - Multi-Role E-Commerce Marketplace

## Overview

SEAPEDIA is a full-stack multi-role e-commerce marketplace developed with **Next.js**, **Prisma**, and **MySQL**. The application supports multiple user roles including **Buyer**, **Seller**, **Admin**, and **Driver**, allowing users to perform real marketplace transactions from product listing to order delivery.

**Live Demo:** https://YOUR-VERCEL-DOMAIN.vercel.app

---

# Features

## Authentication

* Register
* Login
* Logout
* Role-Based Access Control (RBAC)

---

## Buyer Features

* Browse Products
* Product Search
* Product Detail
* Product Reviews & Ratings
* Shopping Cart
* Shipping Fee Calculation
* Checkout
* Order History
* Order Detail
* Profile Management
* Shipping Address Management

---

## Seller Features

* Seller Dashboard
* Add Product
* Edit Product
* Delete Product
* Manage Products
* View Customer Orders

---

## Admin Features

* Dashboard Statistics
* Manage Users
* Manage Products
* Manage Orders
* Update Order Status

---

## Driver Features

* Driver Dashboard
* Available Delivery Jobs
* Delivery History
* Delivery Earnings

---

# Technology Stack

### Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js Route Handlers
* Prisma ORM
* Auth.js

### Database

* MySQL

### Deployment

* Vercel
* Railway MySQL

---

# Project Structure

```
src/
 ├── app/
 ├── components/
 ├── lib/
 ├── auth.ts
 └── middleware.ts

prisma/
 ├── schema.prisma
 ├── migrations/
 └── seed.ts

public/
```

---

# Installation

Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/SEAPEDIA.git

cd SEAPEDIA
```

Install dependencies

```bash
npm install
```

Configure environment variables

```env
DATABASE_URL=

AUTH_SECRET=

AUTH_URL=
```

Run migration

```bash
npx prisma migrate deploy
```

Seed database

```bash
npx prisma db seed
```

Run application

```bash
npm run dev
```

---

# Demo Accounts

## Admin

Email

```
admin@seapedia.com
```

Password

```
admin123
```

---

## Seller

Email

```
seller1@seapedia.com
```

Password

```
admin123
```

---

## Buyer

Email

```
buyer1@seapedia.com
```

Password

```
admin123
```

---

## Driver

Email

```
driver@seapedia.com
```

Password

```
admin123
```

---

# Database

The project uses Prisma ORM with MySQL.

Database migration

```bash
npx prisma migrate deploy
```

Seed database

```bash
npx prisma db seed
```

---

# Security

The application implements several security mechanisms:

* Password hashing using bcrypt
* Authentication using Auth.js
* Role-Based Access Control (RBAC)
* Prisma ORM to reduce SQL Injection risk
* Server-side authorization checks
* Input validation on API endpoints
* Protected routes using middleware

---

# API Documentation

The API collection is available in:

```
postman/SEAPEDIA.postman_collection.json
```

---

# Deployment

Frontend

* Vercel

Database

* Railway MySQL

---

# Contributors

* M R

---

# License

This project was developed for the Software Engineering Academy assignment and educational purposes only.
