import { useState, useEffect, useRef } from "react";

const ProjectSelect = ({
  projects,
  projectPagination,
  fetchProjects,
  newVehicle,
  setNewVehicle,
  isArabic,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {isArabic ? "مشروع" : "Project"}
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer flex justify-between items-center"
      >
        <span>
          {projects.find((c) => c._id === newVehicle.project)
            ? isArabic
              ? projects.find((c) => c._id === newVehicle.project)?.name
              : projects.find((c) => c._id === newVehicle.project)?.name
            : isArabic
            ? "اختر المشروع"
            : "Select Project"}
        </span>
        <span className="text-gray-500">▾</span>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {projects
            .filter((p) => p._id !== "all")
            .map((project) => (
              <div
                key={project._id}
                onClick={() => {
                  setNewVehicle({ ...newVehicle, project: project._id });
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                  newVehicle.project === project._id ? "bg-blue-50" : ""
                }`}
              >
                {isArabic ? project.name : project.name}
              </div>
            ))}

          <div className="border-t my-1"></div>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50">
            <button
              disabled={projectPagination.page <= 1}
              onClick={(e) => {
                e.stopPropagation();
                fetchProjects(projectPagination.page - 1);
              }}
              className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              ⬅ {isArabic ? "السابق" : "Previous"}
            </button>
            <span className="text-xs text-gray-500">
              {projectPagination.page} / {projectPagination.totalPages}
            </span>
            <button
              disabled={projectPagination.page >= projectPagination.totalPages}
              onClick={(e) => {
                e.stopPropagation();
                fetchProjects(projectPagination.page + 1);
              }}
              className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              {isArabic ? "التالي" : "Next"} ➡
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelect;
