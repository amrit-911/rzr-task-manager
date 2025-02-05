import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

import {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

router.route("/").get(protect, getProject).post(protect, createProject);

router.route("/:id").put(protect, updateProject).delete(protect, deleteProject);

export default router;
