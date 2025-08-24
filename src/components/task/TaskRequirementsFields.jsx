import React from "react";

const TaskRequirementsFields = ({ newTask, setNewTask, isArabic }) => {
  const renderRequirementsFields = () => {
    switch (newTask.type) {
      case "Driver Assignment":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الرخصة المطلوبة" : "Required License Type"}
                </label>
                <select
                  value={newTask.requirements.licenseType}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        licenseType: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select License Type</option>
                  <option value="Light Vehicle License">
                    Light Vehicle License
                  </option>
                  <option value="Heavy Vehicle License">
                    Heavy Vehicle License
                  </option>
                  <option value="Motorcycle License">Motorcycle License</option>
                  <option value="Bus License">Bus License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "سنوات الخبرة المطلوبة" : "Required Experience"}
                </label>
                <select
                  value={newTask.requirements.experience}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        experience: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Experience</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "Manpower Deployment":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عدد العمال" : "Worker Count"}
                </label>
                <input
                  type="number"
                  value={newTask.requirements.workerCount}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        workerCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المدة" : "Duration"}
                </label>
                <select
                  value={newTask.requirements.duration}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        duration: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Duration</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المهارات المطلوبة" : "Required Skills"}
                </label>
                <input
                  type="text"
                  placeholder={
                    isArabic
                      ? "مثال: لحام، بناء، كهرباء"
                      : "e.g., Welding, Construction, Electrical"
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        );

      case "Vehicle Maintenance":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عدد المركبات" : "Vehicle Count"}
                </label>
                <input
                  type="number"
                  value={newTask.requirements.vehicleCount}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        vehicleCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "نوع الصيانة" : "Maintenance Type"}
                </label>
                <select
                  value={newTask.requirements.maintenanceType}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        maintenanceType: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Corrective">Corrective</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "الوقت المقدر" : "Estimated Time"}
                </label>
                <select
                  value={newTask.requirements.estimatedTime}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        estimatedTime: e.target.value,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Time</option>
                  <option value="2 hours">2 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="1 day">1 day</option>
                  <option value="2 days">2 days</option>
                  <option value="1 week">1 week</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "Site Work":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عدد المشرفين" : "Supervisors"}
                </label>
                <input
                  type="number"
                  value={newTask.requirements.supervisors}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        supervisors: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "عدد العمال" : "Workers"}
                </label>
                <input
                  type="number"
                  value={newTask.requirements.workerCount}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requirements: {
                        ...newTask.requirements,
                        workerCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المعدات المطلوبة" : "Required Equipment"}
                </label>
                <input
                  type="text"
                  placeholder={
                    isArabic
                      ? "مثال: حفارات، شاحنات، معدات السلامة"
                      : "e.g., Excavators, Trucks, Safety Gear"
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderRequirementsFields();
};

export default TaskRequirementsFields;