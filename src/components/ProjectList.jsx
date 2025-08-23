import React, { useState, useEffect } from "react";
import { Briefcase, Eye, Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/financialCalculations";
import ProjectServiceClient from "../services/ProjectServiceClient";
import ProjectDetailsModal from "./ProjectDetailsModal";
import UpdateProjectModal from "./UpdateProjectModal";

export const ProjectList = ({
  projects,
  attendance,
  isArabic,
  loading,
  onAddProject,
  getStatusColor,
  clients,
}) => {
  const [projectList, setProjectList] = useState(projects);
  const [isDeactivating, setIsDeactivating] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoadingProjectDetails, setIsLoadingProjectDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setSearchLoading(true);
        if (searchQuery.trim().length > 0) {
          const { data } = await ProjectServiceClient.searchProjects(searchQuery.trim());
          setProjectList(data || []);
        } else {
          const { data } = await ProjectServiceClient.getAllProjects();
          setProjectList(data || []);
        }
      } catch (error) {
        console.error("Error searching projects:", error);
      } finally {
        setSearchLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchProjects, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleDeactivateProject = async (projectId, projectName) => {
    const confirmMessage = isArabic
      ? `هل أنت متأكد من أنك تريد إلغاء تفعيل المشروع "${projectName}"؟`
      : `Are you sure you want to deactivate the project "${projectName}"?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setIsDeactivating(projectId);
      await ProjectServiceClient.deactivateProject(projectId);
      setProjectList((prev) => prev.filter((p) => p._id !== projectId));
      alert(isArabic ? "تم إلغاء تفعيل المشروع بنجاح" : "Project deactivated successfully");
    } catch (error) {
      console.error("Error deactivating project:", error);
      alert(isArabic ? "حدث خطأ أثناء إلغاء تفعيل المشروع" : "Error occurred while deactivating the project");
    } finally {
      setIsDeactivating(null);
    }
  };

  const handleViewProject = async (id) => {
    try {
      const { data } = await ProjectServiceClient.getProjectById(id);
      setProjectDetails(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleEditProject = async (id) => {
    try {
      setIsLoadingProjectDetails(true);
      const { data } = await ProjectServiceClient.getProjectById(id);
      setEditingProject(data);
      setIsUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching project for editing:", error);
    } finally {
      setIsLoadingProjectDetails(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isArabic ? "جميع المشاريع" : "All Projects"}
          </h2>
          <p className="text-sm text-gray-500">
            {isArabic ? "إجمالي" : "Total"}: {projectList.length}{" "}
            {isArabic ? "مشروع" : "projects"}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? "ابحث عن مشروع..." : "Search project..."}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" size={18} />
          )}
        </div>
      </div>

      {/* Projects */}
      {loading ? (
        <div className="text-center py-12">{isArabic ? "جاري التحميل..." : "Loading..."}</div>
      ) : projectList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
          {projectList.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col"
            >
              {/* Project Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      {isArabic ? "العميل:" : "Client:"} {project.client}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <span>{isArabic ? "الموقع:" : "Location:"}</span>
                    <span className="truncate">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{isArabic ? "الميزانية:" : "Budget:"}</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(project.budget || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="p-4 sm:p-6 border-b border-gray-100 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{isArabic ? "الإيرادات:" : "Revenue:"}</span>
                  <div className="font-semibold text-purple-600">{formatCurrency(project.budget || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">{isArabic ? "الأرباح:" : "Profit:"}</span>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(((project.budget || 0) * (project.profitMargin || 0)) / 100)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">{isArabic ? "هامش الربح:" : "Profit Margin:"}</span>
                  <div className="font-semibold text-yellow-600">{formatPercentage(project.profitMargin || 0)}</div>
                </div>
                <div>
                  <span className="text-gray-600">{isArabic ? "الساعات:" : "Hours:"}</span>
                  <div className="font-semibold text-blue-600">
                    {Array.isArray(attendance)
                      ? attendance
                        .filter((a) => a?.projectId === project._id)
                        .reduce((sum, a) => sum + (a?.hoursWorked || 0), 0)
                      : 0}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2 bg-gray-50 flex flex-wrap md:flex-nowrap justify-start items-center gap-2">
                <button
                  onClick={() => handleViewProject(project._id)}
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" />
                  {isArabic ? "عرض" : "View"}
                </button>

                <button
                  onClick={() => handleEditProject(project._id)}
                  className="flex-1 md:flex-none bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                >
                  <Edit className="w-4 h-4" />
                  {isArabic ? "تعديل" : "Edit"}
                </button>

                <button
                  onClick={() => handleDeactivateProject(project._id, project.name)}
                  disabled={isDeactivating === project._id}
                  className={`flex-1 md:flex-none px-2 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition ${isDeactivating === project._id
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeactivating === project._id
                    ? isArabic
                      ? "جاري الإلغاء..."
                      : "Deactivating..."
                    : isArabic
                      ? "إلغاء تفعيل"
                      : "Deactivate"}
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isArabic ? "لا توجد مشاريع" : "No Projects"}
          </h3>
          <p className="text-gray-500 mb-6">
            {isArabic ? "ابدأ بإنشاء مشروعك الأول" : "Get started by creating your first project"}
          </p>
          <button
            onClick={onAddProject}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition"
          >
            <Plus className="w-5 h-5" />
            {isArabic ? "إضافة مشروع" : "Add Project"}
          </button>
        </div>
      )}

      <ProjectDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={projectDetails}
      />

      <UpdateProjectModal
        isOpen={isUpdateModalOpen}
        isArabic={isArabic}
        clients={clients}
        editingProject={editingProject || {}}
        setEditingProject={setEditingProject}
        onSave={async () => {
          const updated = await ProjectServiceClient.getAllProjects();
          setProjectList(updated.data || []);
          setIsUpdateModalOpen(false);
        }}
        onClose={() => setIsUpdateModalOpen(false)}
        loading={false}
        projectId={editingProject?._id}
        isLoadingProjectDetails={isLoadingProjectDetails}
      />
    </div>
  );
};
