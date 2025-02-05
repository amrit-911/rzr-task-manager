import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskService";

const Tasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete modal

  const navigate = useNavigate();

  const groupTasksByStatus = (tasks) => {
    return {
      todo: tasks.filter((task) => task.status === "To-Do"),
      inProgress: tasks.filter((task) => task.status === "In-Progress"),
      completed: tasks.filter((task) => task.status === "Completed"),
    };
  };

  const statusGroups = groupTasksByStatus(tasks);

  // Status configuration
  const statusColumns = [
    {
      id: "todo",
      title: "To Do",
      color: "bg-blue-100",
      tasks: statusGroups.todo,
    },
    {
      id: "inProgress",
      title: "In Progress",
      color: "bg-yellow-100",
      tasks: statusGroups.inProgress,
    },
    {
      id: "completed",
      title: "Completed",
      color: "bg-green-100",
      tasks: statusGroups.completed,
    },
  ];

  // Initial empty task state
  const emptyTask = {
    title: "",
    description: "",
    status: "To-Do",
    dueDate: new Date().toISOString().split("T")[0], // Today's date as default
  };

  // Form state
  const [formData, setFormData] = useState(emptyTask);
  const openDeleteModal = (task) => {
    setIsDeleteModalOpen(true);
    setSelectedTask(task);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };

  // Handle task deletion
  const handleDelete = async () => {
    try {
      await deleteTask(selectedTask._id);
      const updatedTasks = tasks.filter(
        (task) => task._id !== selectedTask._id
      );
      setTasks(updatedTasks);
      closeDeleteModal();
    } catch (error) {
      setError("Failed to delete task. Please try again.");
      console.error("Delete failed", error);
    }
  };

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(projectId);
        setTasks(data);
        setError(null);
      } catch (error) {
        setError("Failed to load tasks. Please try again later.");
        console.error("Failed to load tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for creating new task
  const openCreateModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setFormData(emptyTask);
  };

  // Open modal for editing task
  const openEditModal = (task) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: new Date(task.dueDate).toISOString().split("T")[0],
    });
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(emptyTask);
    setSelectedTask(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate),
      };

      if (isEditing) {
        await updateTask(selectedTask._id, taskData);
      } else {
        await createTask(projectId, taskData);
      }

      // Refresh tasks after submission
      const updatedTasks = await getTasks(projectId);
      setTasks(updatedTasks);
      closeModal();
    } catch (error) {
      setError(
        `Failed to ${isEditing ? "update" : "create"} task. Please try again.`
      );
      console.error("Operation failed", error);
    }
  };

  // Status styling function
  const getStatusClasses = (status) => {
    switch (status) {
      case "To-Do":
        return "bg-blue-100 text-blue-800";
      case "In-Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Project Tasks</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            + New Task
          </button>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} p-4 rounded-xl shadow-sm`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {column.title}
                </h2>
                <span className="text-sm text-gray-600">
                  ({column.tasks.length})
                </span>
              </div>
              <div className="space-y-4">
                {column.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                    onClick={() => openEditModal(task)}
                  >
                    <div className="p-4 relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-medium text-gray-800 group-hover:text-blue-600">
                          {task.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(task);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4  z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h2 className="text-2xl font-bold mb-6">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                    />
                  </div>

                  {/* Status Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="To-Do">To-Do</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Due Date Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4  z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h2 className="text-2xl font-bold mb-4">Delete Task</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedTask?.title}"? This
                action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
