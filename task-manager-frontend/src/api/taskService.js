import axiosInstance from "./axiosInstance";

export const getTasks = async (projectId) => {
  const response = await axiosInstance.get(`/task/${projectId}`);
  return response.data;
};

export const createTask = async (projectId, taskData) => {
  const response = await axiosInstance.post("/task", {
    ...taskData,
    projectId,
  });
  return response.data;
};

export const updateTask = async (taskId, updatedData) => {
  const response = await axiosInstance.put(`/task/${taskId}`, updatedData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  await axiosInstance.delete(`/task/${taskId}`);
};
