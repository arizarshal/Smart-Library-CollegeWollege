# 📚 Smart Library Borrowing System

A full-stack web application to manage book borrowing, cost calculation, overdue handling, and user balances among students.

---

## 🚀 Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Protected routes

### 📘 Book Management
- Predefined list of 20 books
- Book details: title, author, image, price per day
- Real-time availability tracking

### 🔄 Borrowing Flow
- Borrow one book at a time
- Validation for active borrows & pending payments
- Cost calculation based on borrow duration
- Return book with date selection
- Automatic overdue calculation

### 📊 Dashboard
- Active borrows count
- Total amount due
- User balance
- Borrow history count

### 💳 Payments
- Simulated payment records (PENDING)
- Payment history view

### 👤 Profile
- View user details
- Account balance
- Join date

---

## 🛠 Tech Stack

**Frontend**
- HTML
- CSS
- Vanilla JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

**Security & Utilities**
- Helmet (security headers)
- Rate Limiting
- Morgan (logging)
- CORS


