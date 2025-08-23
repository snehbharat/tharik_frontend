import React from "react";

const ProjectDetailsModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  const client = project.Client_id || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Scrollable Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>

          {/* Project Header */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-500 text-sm">
              {project.description || "No description available"}
            </p>
          </div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Project Details
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Status:</strong> {project.status}</li>
                <li><strong>Risk Level:</strong> {project.riskLevel}</li>
                <li><strong>Contractor:</strong> {project.contractor}</li>
                <li><strong>Location:</strong> {project.location}</li>
                <li><strong>Start Date:</strong> {project.startDate}</li>
                <li><strong>End Date:</strong> {project.endDate}</li>
                <li><strong>Budget:</strong> ${project.budget?.toLocaleString()}</li>
                <li><strong>Profit Margin:</strong> {project.profitMargin}%</li>
                <li><strong>Progress:</strong> {project.progress}%</li>
              </ul>
            </div>

            {/* Client Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Client Details
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Name:</strong> {client.client_name_eng}</li>
                <li><strong>Type:</strong> {client.client_type}</li>
                <li><strong>Contract Value:</strong> ${client.contract_value?.toLocaleString()}</li>
                <li><strong>Expiry:</strong> {client.contract_expiery_date?.slice(0, 10)}</li>
                <li><strong>Status:</strong> {client.status}</li>
                <li><strong>Manpower:</strong> {client.manpower_count}</li>
                <li><strong>Vehicles:</strong> {client.vehicle_count}</li>
                <li><strong>Contact Person:</strong> {client.contact_person}</li>
                <li><strong>Email:</strong> {client.client_email}</li>
                <li><strong>Phone:</strong> {client.client_mobile_number}</li>
              </ul>
            </div>
          </div>

          {/* Status History */}
          {project.statusHistory?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Status History
              </h3>
              <div className="border rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
                {project.statusHistory.map((history) => (
                  <div
                    key={history.id}
                    className="text-sm text-gray-700 border-b last:border-none py-2"
                  >
                    <p><strong>Status:</strong> {history.status}</p>
                    <p><strong>Progress:</strong> {history.progress}%</p>
                    <p><strong>Notes:</strong> {history.notes}</p>
                    <p><strong>Updated By:</strong> {history.updatedBy}</p>
                    <p><strong>Updated At:</strong> {new Date(history.updatedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
