import Project from "../models/project.js";

const createProject = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    if (!name) {
      res.status(400);
      throw new Error("Project name is required");
    }

    const project = await Project.create({
      name,
      description,
      user: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.find({ user: req.user._id.toString() });
    console.log("project", project);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized");
    }
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized");
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project Deleted", project: project });
  } catch (error) {
    next(error);
  }
};

export { createProject, getProject, updateProject, deleteProject };
