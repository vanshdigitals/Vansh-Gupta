# 🎓 EduTrack - Learning Management System

![EduTrack Banner](https://img.shields.io/badge/EduTrack-Learning%20Management%20System-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Created by: Vansh Gupta (@vanshdigitals)**

EduTrack is a powerful backend system designed for educational institutions to manage students, courses, grades, attendance, and generate comprehensive reports. Built using **Node.js**, **Express.js**, and **MySQL**, it supports multiple user roles and secure authentication.

---

## 🚀 Features

### 🔐 **User Management**

- **Student Registration** - Complete student profile handling
- **Faculty Account Creation** - Department association and role management
- **Admin Dashboard** - System oversight and control
- **Secure Authentication** - JWT-based login with password hashing

### 📚 **Academic Management**

- **Course Creation** - Comprehensive course setup and assignment
- **Multi-course Enrollment** - Students can enroll in multiple courses
- **Grade Management** - Grade entry with automated GPA calculation
- **Attendance Tracking** - Real-time attendance with timestamps

### 📊 **Reporting & Analytics**

- **Performance Reports** - Individual and class-level analytics
- **Course Analytics** - Detailed course-wise dashboard
- **Attendance Reports** - Comprehensive filtering options
- **Export Functionality** - JSON/CSV report generation

### 🗃️ **Database Design**

- **Normalized Structure** - 6+ tables following 3NF principles
- **Optimized Queries** - Indexed for better performance
- **Data Validation** - Robust constraints and validation
- **Migration Scripts** - Complete SQL setup included

---

## ✨ **Bonus Features (Optional Enhancements)**

| Feature | Description | Status |
|---------|-------------|--------|
| 📧 **Email Notifications** | Grade update notifications | 🔄 In Progress |
| 🔍 **Advanced Search** | Filters and search functionality | ✅ Complete |
| 📈 **Real-time Dashboard** | Live charts and analytics | 🔄 Planned |
| 📅 **Auto Scheduling** | Automated report generation | 🔄 Planned |
| 🔐 **Two-Factor Auth** | Enhanced security layer | 🔄 Planned |

---

## ⚙️ **Technology Stack**

| **Layer** | **Technology** | **Purpose** |
|-----------|----------------|-------------|
| **Backend Framework** | Node.js + Express.js | Server-side logic & API development |
| **Database** | MySQL | Data storage & management |
| **Authentication** | JWT (Role-based) | Secure user authentication |
| **Testing Framework** | Jest + Supertest | Unit and integration testing |
| **Security** | bcryptjs, express-validator | Password hashing & validation |
| **Documentation** | Swagger / OpenAPI | API documentation |
| **Version Control** | Git + GitHub | Source code management |

---

## 📚 **API Endpoints**

### 🔐 **Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | User registration | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `POST` | `/api/auth/logout` | User logout | ✅ |

### 👥 **User Management Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users` | Get all users | ✅ Admin |
| `GET` | `/api/users/:id` | Get user by ID | ✅ |
| `PUT` | `/api/users/:id` | Update user profile | ✅ |
| `DELETE` | `/api/users/:id` | Delete user | ✅ Admin |

### 📚 **Course Management Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/courses` | Get all courses | ✅ |
| `POST` | `/api/courses` | Create new course | ✅ Faculty/Admin |
| `PUT` | `/api/courses/:id` | Update course | ✅ Faculty/Admin |
| `DELETE` | `/api/courses/:id` | Delete course | ✅ Admin |

### 📝 **Enrollment System Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/enrollments` | Enroll student in course | ✅ |
| `GET` | `/api/enrollments/student/:id` | Get student enrollments | ✅ |
| `DELETE` | `/api/enrollments/:id` | Unenroll student | ✅ |

### 📊 **Grade Management Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/grades` | Add new grade | ✅ Faculty/Admin |
| `GET` | `/api/grades/student/:id` | Get student grades | ✅ |
| `PUT` | `/api/grades/:id` | Update grade | ✅ Faculty/Admin |

### 📅 **Attendance Tracking Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/attendance` | Mark attendance | ✅ Faculty/Admin |
| `GET` | `/api/attendance/student/:id` | Get attendance records | ✅ |

### 📈 **Reports Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/reports/student/:id` | Student performance report | ✅ |
| `GET` | `/api/reports/course/:id` | Course statistics | ✅ Faculty/Admin |

---

## 🧪 **Setup Instructions**

### **📋 Prerequisites**

Make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (Node Package Manager) - Comes with Node.js
- **MySQL Server** (v8 or higher) - [Download here](https://dev.mysql.com/downloads/)

### **1. 📁 Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/vanshdigitals/edutrack-lms.git

# Navigate to project directory
cd "1-EduTrack-LMS"
```

### **2. 📦 Install Dependencies**

```bash
# Install all required packages
npm install
```

### **3. 🗄️ Database Setup**

Create a MySQL database and import the schema:

```sql
-- Create database
CREATE DATABASE edutrack_lms;

-- Use the database
USE edutrack_lms;

-- Import the schema from edutrack_db_design.md
-- Or run the SQL migration scripts
```

### **4. 🔧 Environment Configuration**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=edutrack_lms

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Development
NODE_ENV=development
```

### **5. 🚀 Start the Server**

```bash
# Start the development server
npm start

# Or for development with auto-reload
npm run dev
```

You should see:
```
🎓 EduTrack Server running on port 5000
📊 Connected to MySQL Database: edutrack_lms
```

---

## 🧪 **Testing**

EduTrack includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run specific test files
npm test auth.test.js
npm test user.test.js
npm test course.test.js
npm test enrollment.test.js
npm test grade.test.js
npm test attendance.test.js
npm test report.test.js

# Run tests with coverage
npm run test:coverage
```

---

## 🗂️ **Project Structure**

```
1-EduTrack-LMS/
├── server.js                 # Main server file
├── db.js                     # Database configuration
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (create this)
├── errorHandler.js           # Global error handling middleware
├── authController.js         # Authentication logic
├── authRoutes.js             # Authentication endpoints
├── authMiddleware.js         # JWT verification middleware
├── userController.js         # User CRUD operations
├── userRoutes.js             # User management endpoints
├── courseController.js       # Course management logic
├── courseRoutes.js           # Course endpoints
├── enrollmentController.js   # Enrollment system logic
├── enrollmentRoutes.js       # Enrollment endpoints
├── gradeController.js        # Grade management logic
├── gradeRoutes.js            # Grade endpoints
├── attendanceController.js   # Attendance tracking logic
├── attendanceRoutes.js       # Attendance endpoints
├── reportController.js       # Reporting system logic
├── reportRoutes.js           # Report endpoints
├── edutrack_db_design.md     # Database schema documentation
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Test setup file
├── babel.config.js           # Babel configuration
└── tests/                    # Test files
    ├── auth.test.js          # Authentication tests
    ├── user.test.js          # User management tests
    ├── course.test.js        # Course tests
    ├── enrollment.test.js    # Enrollment tests
    ├── grade.test.js         # Grade tests
    ├── attendance.test.js    # Attendance tests
    └── report.test.js        # Report tests
```

---

## 🔒 **Security Features**

- **JWT Authentication** - Token-based secure authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Input Validation** - express-validator for data sanitization
- **CORS Protection** - Cross-origin resource sharing control
- **SQL Injection Prevention** - Parameterized queries
- **Role-based Access Control** - Admin, Faculty, Student roles
- **Rate Limiting** - API request throttling
- **Environment Variables** - Secure configuration management

---

## 📖 **Documentation**

- ✅ **Complete API Documentation** - All endpoints documented
- ✅ **Database Schema Design** - Comprehensive ER diagrams
- ✅ **Test Coverage** - All endpoints tested
- ✅ **Setup Guide** - Detailed installation instructions
- ✅ **Security Guidelines** - Best practices included
- ✅ **Deployment Guide** - Production setup instructions

---

## 🎯 **Future Enhancements**

### **🔧 Technical Improvements**

- **Redis Caching** - Improve API response times
- **GraphQL API** - More flexible data querying
- **Microservices** - Break into smaller services
- **Docker Support** - Containerization for easy deployment
- **CI/CD Pipeline** - Automated testing and deployment

### **✨ Feature Expansions**

- **Real-time Notifications** - WebSocket integration
- **Mobile App API** - React Native compatibility
- **Advanced Analytics** - Machine learning insights
- **File Upload System** - Assignment submission support
- **Calendar Integration** - Schedule management

---

## 👨‍💻 **Developer Information**

### **👨‍💻 Project Creator**

**Vansh Gupta** | *Full Stack Developer*

- **GitHub:** [@vanshdigitals](https://github.com/vanshdigitals)
- **Email:** [vanshdigitalsiscreative@gmail.com](mailto:vanshdigitalsiscreative@gmail.com)
- **LinkedIn:** [Connect with me](https://linkedin.com/in/vanshdigitals)
- **Portfolio:** [vanshdigitals.dev](https://vanshdigitals.dev)
- **Project Created:** July 2025

### **🏗️ Project Details**

- **Development Timeline:** July 2025
- **Current Version:** 1.0.0
- **Architecture:** RESTful API with MySQL Database
- **Primary Language:** JavaScript (Node.js)
- **Framework:** Express.js with comprehensive middleware

---

## 📄 **License**

```text
ISC License

Copyright (c) 2025 Vansh Gupta (vanshdigitals)

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS.
```

---

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

### **Development Setup**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⭐ **Support the Project**

If you find this project helpful, please consider:

- ⭐ **Starring** the repository
- 🍴 **Forking** for your own projects
- 📢 **Sharing** with your network
- 🐛 **Reporting** any issues you find

---

**Built with ❤️ by Vansh Gupta | Part of Yhills Full Stack Web Development Course**
