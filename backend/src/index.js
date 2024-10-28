import dotenv from 'dotenv';
import connectDb from './db.js';
import { app } from './app.js';
import { PORT } from './constant.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config({
    path: "./env"
});

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000","https://connect-us-psi.vercel.app"],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
});

// Database connection
connectDb()
    .then(() => {
        server.listen(PORT || 8043, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });

        // Socket.io connection setup
        io.on("connection", (socket) => {
            console.log("New client connected:", socket.id);

            // Join user-specific room for notifications and chat
            socket.on("joinRoom", (roomId) => {
                socket.join(roomId);
                console.log(`User joined room: ${roomId}`);
            });

            // Handle real-time chat messages
            socket.on("sendMessage", (messageData) => {
                const { receiverId, message, senderId } = messageData;
                // Emit to the specific receiver's room
                io.to(receiverId).emit("receiveMessage", { senderId, message });
                console.log(`Message sent to ${receiverId}`);
            });

            // Handle real-time notifications (e.g., like, follow)
            socket.on("sendNotification", (notificationData) => {
                const { receiverId, type, senderId } = notificationData;
                io.to(receiverId).emit("receiveNotification", { type, senderId });
                console.log(`Notification sent to ${receiverId}`);
            });

            // Handle disconnection
            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed!", err);
    });

// Helper function to emit notifications
const sendNotification = (userId, notification) => {
    io.to(userId).emit("notification", notification);
};

export { server, io, sendNotification };
