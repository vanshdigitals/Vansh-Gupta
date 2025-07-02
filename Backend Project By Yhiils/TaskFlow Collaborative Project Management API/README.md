# 🗂️ TaskFlow - Collaborative Project Management API

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-Project%20Management%20API-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

TaskFlow is a scalable REST API designed for managing collaborative projects, tasks, and teams in real time. Built using **Node.js**, **Express.js**, and **MySQL**, it includes WebSocket integration for real-time features, role-based access control, and comprehensive project management capabilities.

---

## 🚀 Features

### 🧑‍💼 **Project & Team Management**

- **Multi-level Project Creation** - Organize projects with hierarchical structure
- **Role-based Team Assignments** - Admin, Manager, and Member roles
- **Project Tracking** - Complete project lifecycle management
- **Team Collaboration** - Seamless team coordination tools

### ✅ **Advanced Task Management**

- **Task Creation** with priority levels and custom tags
- **Multiple Assignees** per task for collaborative work
- **Status Workflow** - Custom task status management
- **Task Dependencies** - Link related tasks for better planning

### 🤝 **Real-time Collaboration**

- **Comment System** with threaded discussions
- **Activity Timeline** - Track all project activities
- **Live Notifications** - Real-time updates via WebSocket
- **Team Communication** - Instant messaging and updates

### 📊 **Analytics & Insights**

- **Progress Tracking** - Real-time project progress monitoring
- **Performance Metrics** - Team productivity analytics
- **Reporting Dashboard** - Generate detailed project reports
- **Data Visualization** - Charts and graphs for insights

---

## ✨ Core Capabilities

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **Authentication** | JWT-based secure user authentication | ✅ Complete |
| 🏗️ **Project Management** | Full CRUD operations for projects | ✅ Complete |
| 📋 **Task Management** | Comprehensive task lifecycle management | ✅ Complete |
| 💬 **Comment System** | Threaded comments on tasks | ✅ Complete |
| 🔔 **Notifications** | Real-time notification system | ✅ Complete |
| 🌐 **Real-time Updates** | WebSocket integration | ✅ Complete |
| ⚡ **Input Validation** | Robust data validation | ✅ Complete |
| 🛡️ **Error Handling** | Comprehensive error management | ✅ Complete |
| 🌍 **CORS Support** | Cross-origin resource sharing | ✅ Complete |

---

## ⚙️ **Technology Stack**

| **Layer** | **Technology** | **Purpose** |
|-----------|----------------|-------------|
| **Backend Framework** | Node.js + Express.js | Server-side logic & API development |
| **Database** | MySQL | Data storage & management |
| **Real-time Communication** | Socket.IO | WebSocket for live updates |
| **Authentication** | JWT + bcryptjs | Secure user authentication |
| **Validation** | express-validator | Input data validation |
| **Environment** | dotenv | Configuration management |
| **Cross-Origin** | CORS | Cross-origin resource sharing |

---

## 🧪 **Setup Instructions**

### **📋 Prerequisites**

Make sure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (Node Package Manager) - Comes with Node.js
- **MySQL Server** (v8 or higher) - [Download here](https://dev.mysql.com/downloads/)

### **1. 📁 Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/vanshdigitals/taskflow-api.git

# Navigate to project directory
cd taskflow-backend
```

### **2. 📦 Install Dependencies**

```bash
# Install all required packages
npm install
```

### **3. 🗄️ Database Setup**

#### **Create MySQL Database and User:**

Open your MySQL client and run the following commands:

```sql
-- Create database
CREATE DATABASE taskflow_db;

-- Create dedicated user
CREATE USER 'taskflow_user'@'localhost' IDENTIFIED BY 'taskflow_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON taskflow_db.* TO 'taskflow_user'@'localhost';
FLUSH PRIVILEGES;
```

#### **Run Migration Script:**

```bash
# Execute the setup script
sudo mysql -u taskflow_user -ptaskflow_password taskflow_db < taskflow_setup.sql
```

### **4. 🔧 Environment Configuration**

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=taskflow_user
DB_PASSWORD=taskflow_password
DB_NAME=taskflow_db

# Server Configuration
PORT=3001

# Security
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Optional: Add more environment variables as needed
NODE_ENV=development
```

### **5. 🚀 Start the Server**

```bash
# Start the development server
npm start

# Or use nodemon for development
npm run dev
```

You should see:
```
🚀 TaskFlow Server running on port 3001
📊 Connected to MySQL Database: taskflow_db
```

---

## 📡 **API Endpoints**

The TaskFlow API follows RESTful principles with comprehensive endpoint coverage for all features.

### 🔐 **Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register a new user account | ❌ |
| `POST` | `/api/auth/login` | User login & JWT token generation | ❌ |

### 🏗️ **Project Management Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/projects` | Retrieve all user projects | ✅ |
| `GET` | `/api/projects/:id` | Get specific project details | ✅ |
| `POST` | `/api/projects` | Create a new project | ✅ |
| `PUT` | `/api/projects/:id` | Update project information | ✅ |
| `DELETE` | `/api/projects/:id` | Delete a project | ✅ |

### ✅ **Task Management Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tasks` | Get all tasks for user | ✅ |
| `GET` | `/api/tasks/:id` | Retrieve specific task details | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PUT` | `/api/tasks/:id` | Update task information | ✅ |
| `DELETE` | `/api/tasks/:id` | Remove a task | ✅ |

### 💬 **Comment System Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/comments/task/:taskId` | Get all comments for a task | ✅ |
| `POST` | `/api/comments` | Add a new comment to task | ✅ |
| `PUT` | `/api/comments/:id` | Update existing comment | ✅ |
| `DELETE` | `/api/comments/:id` | Delete a comment | ✅ |

### 🔔 **Notification Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/notifications/user/:userId` | Get user notifications | ✅ |
| `PUT` | `/api/notifications/mark-read/:id` | Mark notification as read | ✅ |
| `DELETE` | `/api/notifications/:id` | Delete a notification | ✅ |

---

## 🌐 **Real-time Features (WebSocket)**

TaskFlow leverages **Socket.IO** for real-time communication and live updates across the application.

### **🔗 WebSocket Events**

| Event | Direction | Description | Data Format |
|-------|-----------|-------------|-------------|
| `connection` | Client → Server | New client connects | Connection object |
| `disconnect` | Client → Server | Client disconnects | Disconnect reason |
| `taskUpdate` | Client → Server | Task modification event | `{taskId, updates}` |
| `taskUpdated` | Server → Clients | Broadcast task changes | `{taskId, newData}` |
| `notification` | Server → Client | Real-time notifications | `{type, message, data}` |

### **📱 Client-Side Integration Example**

```javascript
// Initialize Socket.IO connection
const socket = io("http://localhost:3001");

// Connection event handlers
socket.on("connect", () => {
    console.log("🔗 Connected to TaskFlow WebSocket");
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from TaskFlow");
});

// Real-time task updates
socket.on("taskUpdated", (taskData) => {
    console.log("📋 Task updated:", taskData);
    updateUIWithNewTaskData(taskData);
});

// Real-time notifications
socket.on("notification", (notification) => {
    console.log("🔔 New notification:", notification);
    showNotificationInUI(notification);
});

// Send task update to server
function updateTask(taskId, updates) {
    socket.emit("taskUpdate", { 
        taskId: taskId, 
        updates: updates,
        timestamp: new Date().toISOString()
    });
}
```

---

## 🎯 **Future Enhancements & Roadmap**

### **🔧 Technical Improvements**

- **Enhanced Logging System** - Implement structured logging with Winston
- **Comprehensive Testing** - Unit, integration, and end-to-end test coverage
- **API Optimization** - Add pagination, filtering, and advanced sorting
- **Database Migration** - Consider Sequelize ORM for better database management
- **Containerization** - Docker support for easy deployment

### **✨ Feature Expansions**

- **File Upload System** - Document and media attachment support
- **Advanced Analytics** - Detailed project insights and reporting
- **Integration APIs** - GitHub, Slack, and third-party tool connections
- **Mobile App Support** - Dedicated mobile application
- **AI-Powered Features** - Smart task recommendations and insights

### **🚀 Deployment & Scaling**

- **Cloud Integration** - AWS/GCP deployment configuration
- **Load Balancing** - Horizontal scaling support
- **Caching Layer** - Redis integration for improved performance
- **CDN Support** - Asset delivery optimization

---

## 🧑‍💻 **Developer Information**

### **👨‍💻 Project Creator**

**Vansh Gupta** | *Full Stack Developer*

- **GitHub:** [@vanshdigitals](https://github.com/vanshdigitals)
- **Email:** [vanshdigitalsiscreative@gmail.com](mailto:vanshdigitalsiscreative@gmail.com)
- **Portfolio:** [vanshdigitals.dev](https://vanshdigitals.dev)
- **Project Created:** July 2025

### **🏗️ Project Details**

- **Development Timeline:** July 2025
- **Current Version:** 1.0.0
- **Architecture:** RESTful API with Real-time WebSocket
- **Primary Language:** JavaScript (Node.js)
- **Framework:** Express.js with MySQL Database

---

## 📄 **License & Copyright**

```text
MIT License

Copyright (c) 2025 Vansh Gupta (vanshdigitals)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

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