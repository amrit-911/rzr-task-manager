import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../api/projectService";
import { toast } from "react-toastify";
import {
  LucideDelete,
  LucideFolder,
  LucidePlus,
  LucideTrash2,
} from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState({
    name: "",
    description: "",
  });
  const navigate = useNavigate();

  // Fetch projects manually using useEffect
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Open modal for creating a new project
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewProjectName({
      name: "",
      description: "",
    });
  };

  // Handle project creation
  const handleCreate = async () => {
    if (!newProjectName.name.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }
    try {
      const newProject = await createProject(newProjectName);
      setProjects([...projects, newProject]); // Update local state
      toast.success("Project created!");
      closeModal(); // Close modal after creation
    } catch (error) {
      toast.error("Failed to create project");
    }
  };
  const handleDelete = async () => {
    try {
      await deleteProject(selectedProject._id);
      setProjects(
        projects.filter((project) => project._id !== selectedProject._id)
      );
      toast.success("Project deleted!");
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete project");
      closeDeleteModal();
    }
  };

  // Delete modal handlers
  const openDeleteModal = (project) => {
    setIsDeleteModalOpen(true);
    setSelectedProject(project);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProject(null);
  };

  // Navigate to project details page
  const handleCardClick = (projectId) => {
    navigate(`/${projectId}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-8">
      <div className="  mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
              My Projects
            </h1>
            <p className="text-gray-500">
              Organize your work and collaborate with your team
            </p>
          </div>
          <button
            onClick={openModal}
            className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center gap-2"
          >
            <LucidePlus size={20} />
            Create Project
          </button>
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <LucideFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500">
                Get started by creating a new project
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100 cursor-pointer"
              onClick={() => handleCardClick(project._id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(project);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors z-10"
              >
                <LucideDelete className="w-5 h-5" />
              </button>

              <div className="flex flex-col h-full">
                <LucideFolder className="w-8 h-8 text-blue-600 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                  {project.name}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-3 flex-1">
                  {project.description || "No description"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4  z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-pop-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                New Project
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marketing Campaign"
                    value={newProjectName.name}
                    onChange={(e) =>
                      setNewProjectName((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Add a brief description..."
                    value={newProjectName.description}
                    onChange={(e) =>
                      setNewProjectName((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-24 resize-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  <LucidePlus size={18} />
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4  z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-pop-in">
              <div className="text-center">
                <LucideTrash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4 ">
                  Delete Project
                </h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    "{selectedProject?.name}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="px-6 cursor-pointer py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 cursor-pointer py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  <LucideTrash2 className="w-5 h-5" />
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
