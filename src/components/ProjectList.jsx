import React, { useState, useEffect } from "react";
import { 
  Briefcase, Eye, Edit, Trash2, Plus, Search, Loader2,
  DollarSign, TrendingUp, Users, Clock, AlertTriangle,
  CheckCircle, MapPin, Calendar, BarChart3
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/financialCalculations";
import ProjectServiceClient from "../services/ProjectServiceClient";
import ProjectDetailsModal from "./ProjectDetailsModal";
import UpdateProjectModal from "./UpdateProjectModal";
import { employeeService } from "../services/EmployeeService";

// Add these calculation functions
const calculateFinancials = (regularHours, overtimeHours, hourlyRate, actualRate) => {
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * 1.5;
  const laborCost = regularPay + overtimePay;

  const regularRevenue = regularHours * actualRate;
  const overtimeRevenue = overtimeHours * actualRate * 1.5;
  const revenue = regularRevenue + overtimeRevenue;

  const profit = revenue - laborCost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const totalHours = regularHours + overtimeHours;
  const effectiveRate = totalHours > 0 ? revenue / totalHours : 0;

  return {
    laborCost: Number(laborCost.toFixed(2)),
    revenue: Number(revenue.toFixed(2)),
    profit: Number(profit.toFixed(2)),
    profitMargin: Number(profitMargin.toFixed(2)),
    regularPay: Number(regularPay.toFixed(2)),
    overtimePay: Number(overtimePay.toFixed(2)),
    totalHours,
    effectiveRate: Number(effectiveRate.toFixed(2))
  };
};

const calculateProjectMetrics = (projectId, employees, attendance) => {
  // Filter employees for this project with active status
  const projectEmployees = employees.filter(emp => 
    emp.project_id?._id === projectId && emp.status === 'active'
  );
  
  // Filter attendance records for employees in this project
  const projectAttendance = attendance.filter(record => {
    const employee = employees.find(emp => emp._id === record.employee?._id);
    return employee?.project_id?._id === projectId;
  });

  const projectWorkforce = projectEmployees.length;

  let clientBilling = 0;
  let laborCosts = 0;

  projectAttendance.forEach(record => {
    const employee = employees.find(emp => emp._id === record.employee?._id);
    if (employee) {
      const hourlyRate = parseFloat(employee.hourly_rate?.$numberDecimal || 0);
      const actualRate = parseFloat(employee.actual_rate?.$numberDecimal || 0);
      
      const financials = calculateFinancials(
        record.hoursWorked || 0,
        record.overtimeHours || 0,
        hourlyRate,
        actualRate
      );
      clientBilling += financials.revenue;
      laborCosts += financials.laborCost;
    }
  });

  const realTimeProfit = clientBilling - laborCosts;
  
  const totalHours = projectAttendance.reduce((total, record) => 
    total + (record.hoursWorked || 0) + (record.overtimeHours || 0), 0
  );
  const productivity = totalHours > 0 ? clientBilling / totalHours : 0;
  
  const workerEfficiency = projectWorkforce > 0 ? realTimeProfit / projectWorkforce : 0;

  const expectedAttendance = projectEmployees.length * 22;
  const actualAttendance = projectAttendance.length;
  const attendanceRate = expectedAttendance > 0 ? (actualAttendance / expectedAttendance) * 100 : 0;

  const totalOvertimeHours = projectAttendance.reduce((total, record) => 
    total + (record.overtimeHours || 0), 0
  );
  const overtimePercentage = totalHours > 0 ? (totalOvertimeHours / totalHours) * 100 : 0;

  return {
    projectWorkforce,
    clientBilling: Number(clientBilling.toFixed(2)),
    realTimeProfit: Number(realTimeProfit.toFixed(2)),
    laborCosts: Number(laborCosts.toFixed(2)),
    productivity: Number(productivity.toFixed(2)),
    workerEfficiency: Number(workerEfficiency.toFixed(2)),
    attendanceRate: Number(attendanceRate.toFixed(2)),
    overtimePercentage: Number(overtimePercentage.toFixed(2)),
    totalHours: Number(totalHours.toFixed(2))
  };
};

export const ProjectList = ({
  clients,
  projects,
  attendance,
  isArabic,
  loading,
  onAddProject,
  getStatusColor,
}) => {
  const [projectList, setProjectList] = useState(projects);
  const [employee, setEmployee] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]); // Store fetched attendance
  const [isDeactivating, setIsDeactivating] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isLoadingProjectDetails, setIsLoadingProjectDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Helper function to safely extract projects data from API response
  const extractProjectsData = (response) => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (response.data?.projects && Array.isArray(response.data.projects)) return response.data.projects;
    if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
    if (Array.isArray(response)) return response;
    console.warn('Unexpected API response structure in ProjectList:', response);
    return [];
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployee(response?.data?.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch all attendance (last 1 year to current date)
  const fetchAllAttendance = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      const response = await employeeService.getAllAttendance(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setAllAttendance(response.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // Fetch employees and attendance on mount
  useEffect(() => {
    fetchEmployees();
    fetchAllAttendance();
  }, []);

  // Update projectList when projects prop changes - show only active projects
  useEffect(() => {
    const activeProjects = projects.filter(project =>
      project?.status?.toLowerCase() === "active"
    );
    setProjectList(activeProjects);
  }, [projects]);

  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      const activeProjects = projects.filter(project =>
        project?.status?.toLowerCase() === "active"
      );
      setProjectList(activeProjects);
      setSearchLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        setSearchLoading(true);
        const response = await ProjectServiceClient.searchProjects(searchQuery.trim());
        const searchResults = extractProjectsData(response);
        const activeSearchResults = searchResults.filter(project =>
          project?.status?.toLowerCase() === "active"
        );
        setProjectList(activeSearchResults);
      } catch (error) {
        console.error("Error searching projects:", error);
        const activeProjects = projects.filter(project =>
          project?.status?.toLowerCase() === "active"
        );
        setProjectList(activeProjects);
      } finally {
        setSearchLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchProjects, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, projects]);

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
      const response = await ProjectServiceClient.getProjectById(id);
      const projectData = response?.data || response;
      setProjectDetails(projectData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleEditProject = async (id) => {
    try {
      setIsLoadingProjectDetails(true);
      setSelectedProjectId(id);
      setEditingProject(null);

      const response = await ProjectServiceClient.getProjectById(id);
      const projectData = response?.data || response;

      const formattedProject = {
        ...projectData,
        startDate: projectData.startDate ? projectData.startDate.split('T')[0] : '',
        endDate: projectData.endDate ? projectData.endDate.split('T')[0] : '',
        clientId: projectData.Client_id?._id || projectData.clientId || projectData.Client_id
      };

      setEditingProject(formattedProject);
      setIsUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching project for editing:", error);
    } finally {
      setIsLoadingProjectDetails(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    const activeProjects = projects.filter(project =>
      project?.status?.toLowerCase() === "active"
    );
    setProjectList(activeProjects);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setEditingProject(null);
    setSelectedProjectId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            {searchQuery.trim() ? (
              <>
                {isArabic ? "نتائج البحث:" : "Search results:"} {projectList.length}{" "}
                {isArabic ? "مشروع" : "projects"}
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                >
                  {isArabic ? "عرض الكل" : "Show all"}
                </button>
              </>
            ) : (
              <>
                {isArabic ? "إجمالي" : "Total"}: {projectList.length}{" "}
                {isArabic ? "مشروع" : "projects"}
              </>
            )}
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
          {searchQuery.trim() && !searchLoading && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Projects */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p>{isArabic ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      ) : projectList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectList.map((project) => {
            // Calculate metrics for each project
            const metrics = calculateProjectMetrics(
              project._id || project.id,
              employee,
              allAttendance
            );

            return (
              <div
                key={project._id || project.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Project Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {isArabic ? "العميل:" : "Client:"} {project.client_name || project.client}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      {project.riskLevel && (
                        <div className={`text-xs font-semibold ${getRiskColor(project.riskLevel)}`}>
                          {isArabic ? 'المخاطر:' : 'Risk:'} {project.riskLevel}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-4 sm:px-6 pt-4 pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700 tracking-tight">
                      {isArabic ? 'التقدم' : 'Progress'}
                    </span>
                    <span className="text-sm font-bold text-gray-900 tracking-tight">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200/80 rounded-full h-3 shadow-inner">
                    <div
                      className={`h-3 rounded-full transition-all duration-700 shadow-sm ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Financial Metrics - NEW SECTION */}
                <div className="px-4 sm:px-6 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-700 font-semibold">
                          {isArabic ? 'الإيرادات' : 'Revenue'}
                        </span>
                      </div>
                      <div className="text-base font-bold text-green-800">
                        {formatCurrency(metrics.clientBilling)}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700 font-semibold">
                          {isArabic ? 'الأرباح' : 'Profit'}
                        </span>
                      </div>
                      <div className="text-base font-bold text-blue-800">
                        {formatCurrency(metrics.realTimeProfit)}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-purple-700 font-semibold">
                          {isArabic ? 'العمال' : 'Workers'}
                        </span>
                      </div>
                      <div className="text-base font-bold text-purple-800">
                        {metrics.projectWorkforce}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-3 border border-amber-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-xs text-amber-700 font-semibold">
                          {isArabic ? 'الساعات' : 'Hours'}
                        </span>
                      </div>
                      <div className="text-base font-bold text-amber-800">
                        {metrics.totalHours}h
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPIs - NEW SECTION */}
                <div className="px-4 sm:px-6 pb-4">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{isArabic ? 'هامش الربح:' : 'Profit Margin:'}</span>
                      <span className={`font-bold ${
                        project.profitMargin > 25 ? 'text-green-600' :
                        project.profitMargin > 15 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(project.profitMargin || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{isArabic ? 'الإنتاجية:' : 'Productivity:'}</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(metrics.productivity)}/hr
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{isArabic ? 'الحضور:' : 'Attendance:'}</span>
                      <span className={`font-bold ${
                        metrics.attendanceRate >= 90 ? 'text-green-600' :
                        metrics.attendanceRate >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(metrics.attendanceRate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{isArabic ? 'العمل الإضافي:' : 'Overtime:'}</span>
                      <span className={`font-bold ${
                        metrics.overtimePercentage > 20 ? 'text-red-600' :
                        metrics.overtimePercentage > 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {formatPercentage(metrics.overtimePercentage)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{isArabic ? 'العمل الإضافي:' : 'Effiency:'}</span>
                      <span className={`font-bold ${
                        metrics.workerEfficiency > 20 ? 'text-red-600' :
                        metrics.workerEfficiency > 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {formatPercentage(metrics.workerEfficiency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator - NEW */}
                <div className="px-4 sm:px-6 pb-3">
                  <div className="flex items-center justify-between">
                    {metrics.attendanceRate >= 90 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                          {isArabic ? 'حضور ممتاز' : 'Excellent Attendance'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                          {isArabic ? 'حضور منخفض' : 'Low Attendance'}
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 font-medium">
                      {isArabic ? 'آخر تحديث:' : 'Updated:'} {formatDate(project.updated_at)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2 bg-gray-50 flex flex-wrap md:flex-nowrap justify-start items-center gap-2">
                  <button
                    onClick={() => handleViewProject(project._id || project.id)}
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                  >
                    <Eye className="w-4 h-4" />
                    {isArabic ? "عرض" : "View"}
                  </button>

                  <button
                    onClick={() => handleEditProject(project._id || project.id)}
                    className="flex-1 md:flex-none bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                  >
                    <Edit className="w-4 h-4" />
                    {isArabic ? "تعديل" : "Edit"}
                  </button>

                  <button
                    onClick={() => handleDeactivateProject(project._id || project.id, project.name)}
                    disabled={isDeactivating === (project._id || project.id)}
                    className={`flex-1 md:flex-none px-2 py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition ${
                      isDeactivating === (project._id || project.id)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeactivating === (project._id || project.id)
                      ? isArabic ? "جاري الإلغاء..." : "Deactivating..."
                      : isArabic ? "إلغاء تفعيل" : "Deactivate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery.trim()
              ? (isArabic ? "لم يتم العثور على مشاريع" : "No projects found")
              : (isArabic ? "لا توجد مشاريع" : "No Projects")
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery.trim()
              ? (isArabic ? "جرب البحث بمصطلح مختلف" : "Try searching with different terms")
              : (isArabic ? "ابدأ بإنشاء مشروعك الأول" : "Get started by creating your first project")
            }
          </p>
          {!searchQuery.trim() && (
            <button
              onClick={onAddProject}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition"
            >
              <Plus className="w-5 h-5" />
              {isArabic ? "إضافة مشروع" : "Add Project"}
            </button>
          )}
        </div>
      )}

      <ProjectDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={projectDetails}
      />

      <UpdateProjectModal
        key={selectedProjectId}
        isOpen={isUpdateModalOpen}
        isArabic={isArabic}
        clients={clients}
        editingProject={editingProject || {}}
        setEditingProject={setEditingProject}
        onSave={async () => {
          try {
            const updated = await ProjectServiceClient.getAllProjects();
            const updatedProjects = extractProjectsData(updated);
            setProjectList(updatedProjects);
            setIsUpdateModalOpen(false);
            setEditingProject(null);
            setSelectedProjectId(null);
          } catch (error) {
            console.error("Error refreshing projects after update:", error);
          }
        }}
        onClose={handleUpdateModalClose}
        loading={false}
        projectId={selectedProjectId}
        isLoadingProjectDetails={isLoadingProjectDetails}
      />
    </div>
  );
};