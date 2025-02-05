import axiosInstance from "./axiosInstance";

export const getProjects = async () => {
  const response = await axiosInstance.get("/project");
  return response.data;
};

export const createProject = async (name) => {
  const response = await axiosInstance.post("/project", name);
  return response.data;
};

export const deleteProject = async (projectId) => {
  await axiosInstance.delete(`/project/${projectId}`);
};
