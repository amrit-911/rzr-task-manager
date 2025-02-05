import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

router.get("/:projectId", protect, getTasks);

router.post("/", protect, createTask);

router.put("/:taskId", protect, updateTask);

router.delete("/:taskId", protect, deleteTask);

export default router;
