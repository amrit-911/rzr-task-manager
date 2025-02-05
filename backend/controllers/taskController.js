import Task from "../models/task.js";
import Project from "../models/project.js";

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate, projectId } = req.body;

    if (!title || !projectId) {
      res.status(400);
      throw new Error("Task title and project ID are required");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized to add tasks to this project");
    }

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      project: projectId,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized to add tasks to this project");
    }

    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");
    if (!task || task.project.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error("Task not found or user not authorized");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, dueDate },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");
    if (!task || task.project.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error("Task not found or user not authorized");
    }

    await Task.findByIdAndDelete(taskId);
    res.json({ message: "Task removed" });
  } catch (error) {
    next(error);
  }
};

export { createTask, getTasks, updateTask, deleteTask };
