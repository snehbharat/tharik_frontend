import { useState, useEffect, useRef } from "react";

const ClientSelect = ({
  clients,
  projectPagination,
  fetchClients,
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
        {isArabic ? "عميل" : "Client"}
      </label>

      {/* Fake Select Box */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer flex justify-between items-center"
      >
        <span>
          {clients.find((c) => c._id === newVehicle.client)
            ? isArabic
              ? clients.find((c) => c._id === newVehicle.client)
                  ?.client_name_arb
              : clients.find((c) => c._id === newVehicle.client)
                  ?.client_name_eng
            : isArabic
            ? "اختر عميل"
            : "Select Client"}
        </span>
        <span className="text-gray-500">▾</span>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {clients
            .filter((p) => p._id !== "all")
            .map((client) => (
              <div
                key={client._id}
                onClick={() => {
                  setNewVehicle({ ...newVehicle, client: client._id });
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                  newVehicle.client === client._id ? "bg-blue-50" : ""
                }`}
              >
                {isArabic ? client.client_name_arb : client.client_name_eng}
              </div>
            ))}

          <div className="border-t my-1"></div>
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50">
            <button
              disabled={projectPagination.page <= 1}
              onClick={(e) => {
                e.stopPropagation();
                fetchClients(projectPagination.page - 1);
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
                fetchClients(projectPagination.page + 1);
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

export default ClientSelect;
