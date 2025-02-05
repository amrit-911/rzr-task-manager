import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // allow your frontend URL
    credentials: true, // if you are using cookies, authorization headers, etc.
  })
);
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
