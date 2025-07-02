/**
 * TaskFlow Backend API
 * A project management and collaboration tool
 * 
 * @author Vansh Gupta (vanshdigitals)
 * @email vanshdigitalsiscreative@gmail.com
 * @created July 2025
 */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now, refine later
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
    res.send("TaskFlow Backend API is running!");
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    // Example: Listen for a \'taskUpdate\' event and broadcast it
    socket.on("taskUpdate", (data) => {
        console.log("Task update received:", data);
        io.emit("taskUpdated", data); // Broadcast to all connected clients
    });
});

// Error handling middleware
app.use(errorHandler);

// Export app, server, and io for testing
module.exports = { app, server, io };

// Start the server only if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
        console.log(`TaskFlow Server running on port ${PORT}`);
    });
}


