# 🎓 EduTrack - Learning Management System

EduTrack is a powerful backend system designed for educational institutions to manage students, courses, grades, attendance, and generate comprehensive reports. Built using **Node.js**, **Express.js**, and **MySQL**, it supports multiple user roles and secure authentication.

---

## 🚀 Features

### 🔐 User Management
- Student registration and profile handling
- Faculty account creation with department association
- Admin dashboard for system oversight
- Secure login with JWT-based authentication and password hashing

### 📚 Academic Management
- Course creation and assignment
- Multi-course student enrollment
- Grade entry & automated GPA calculation
- Attendance tracking with time stamps

### 📊 Reporting & Analytics
- Individual & class-level performance reports
- Course-wise analytics dashboard
- Attendance reports with filters
- Export reports as JSON/CSV

### 🗃️ Database Design
- Minimum 6 normalized tables (3NF)
- Indexed queries for optimized performance
- Data validation with constraints
- SQL migration scripts

---

## ✨ Bonus Features (Optional Enhancements)
- 📧 Email notifications on grade updates
- 🔍 Advanced search & filters
- 📈 Real-time dashboard with charts
- 📅 Auto-scheduled report generation
- 🔐 Two-Factor Authentication

---

## ⚙️ Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js + Express.js |
| Database | MySQL |
| Auth | JWT (Role-based) |
| Docs | Swagger / OpenAPI |
| Version Control | Git + GitHub |

---

## 🧪 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/vanshdigitals/edu-track-lms

# Backend setup
cd server
npm install
npm start

# Create a MySQL DB and run migration scripts from /sql
