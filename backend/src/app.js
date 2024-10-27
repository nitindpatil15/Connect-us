import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes import
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import likeRouter from './routes/likeRoutes.js';
import chatRouter from './routes/chatRoutes.js';        // Add Chat Routes
import notificationRouter from './routes/notificationRoutes.js'; // Add Notification Routes

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  headers: ["Content-Type", 'Authorization', 'auth-token'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, auth-token');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Config settings in CORS middleware and parse limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Router Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/chat", chatRouter);                    // Chat Routes
app.use("/api/v1/notifications", notificationRouter);   // Notification Routes

export { app };
