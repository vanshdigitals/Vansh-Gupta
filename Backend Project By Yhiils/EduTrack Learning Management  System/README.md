# 🎓 EduTrack - Learning Management System

**Created by: Vansh Gupta (@vanshdigitals)**

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

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express.js |
| Database | MySQL |
| Authentication | JWT (Role-based) |
| Testing | Jest + Supertest |
| Security | bcryptjs, express-validator |
| Documentation | Swagger / OpenAPI |
| Version Control | Git + GitHub |

---

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### 👥 User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### 📚 Course Management
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### 📝 Enrollment System
- `POST /api/enrollments` - Enroll student in course
- `GET /api/enrollments/student/:id` - Get student enrollments
- `DELETE /api/enrollments/:id` - Unenroll student

### 📊 Grade Management
- `POST /api/grades` - Add new grade
- `GET /api/grades/student/:id` - Get student grades
- `PUT /api/grades/:id` - Update grade

### 📅 Attendance Tracking
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/student/:id` - Get attendance records

### 📈 Reports
- `GET /api/reports/student/:id` - Student performance report
- `GET /api/reports/course/:id` - Course statistics

---

## 🧪 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/vanshdigitals/Vansh-Gupta.git

# Navigate to project directory
cd "Backend Project By Yhiils/EduTrack Learning Management System"

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your database credentials

# Create MySQL database and tables
# Import the database schema from edutrack_db_design.md

# Start the development server
npm start

# Server will run on http://localhost:5000
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test files
npm test auth.test.js
npm test user.test.js
npm test course.test.js
```

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=edutrack_lms
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

## 🗂️ Project Structure

```
├── server.js                 # Main server file
├── db.js                     # Database configuration
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── errorHandler.js           # Global error handling
├── authController.js         # Authentication logic
├── authRoutes.js             # Auth endpoints
├── authMiddleware.js         # JWT verification
├── userController.js         # User CRUD operations
├── courseController.js       # Course management
├── enrollmentController.js   # Enrollment system
├── gradeController.js        # Grade management
├── attendanceController.js   # Attendance tracking
├── reportController.js       # Reporting system
└── tests/                    # Test files
    ├── auth.test.js
    ├── user.test.js
    ├── course.test.js
    └── ...more test files
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS protection
- SQL injection prevention
- Role-based access control

## 📖 Documentation

- Complete API documentation available
- Database schema design included
- Test coverage for all endpoints
- Environment setup guide

---

## 👨‍💻 Author

**Vansh Gupta**
- GitHub: [@vanshdigitals](https://github.com/vanshdigitals)
- Email: vanshdigitalsiscreative@gmail.com
- LinkedIn: [Connect with me](https://linkedin.com/in/vanshdigitals)

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ by Vansh Gupta | Part of Yhills Full Stack Web Development Course**
