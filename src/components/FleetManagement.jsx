import React, { useState } from "react";
import {
  Truck,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Filter,
  Wrench,
  Fuel,
  FileText,
  DollarSign,
  Save,
  X,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Phone,
  User,
  Shield,
  Camera,
  Navigation,
  Settings,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export const FleetManagement = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [selectedProject, setSelectedProject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const projects = [
    { id: "all", nameEn: "All Projects", nameAr: "جميع المشاريع" },
    { id: "aramco", nameEn: "Saudi Aramco", nameAr: "أرامكو السعودية" },
    { id: "sabic", nameEn: "SABIC Industries", nameAr: "صناعات سابك" },
    { id: "neom", nameEn: "NEOM Development", nameAr: "تطوير نيوم" },
  ];

  const vehicleTypes = [
    "Pickup Truck",
    "Heavy Truck",
    "Van",
    "Bus",
    "Crane",
    "Excavator",
    "Bulldozer",
    "Loader",
    "Dump Truck",
    "Concrete Mixer",
    "Forklift",
  ];

  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      plateNumber: "س أ ب-1234",
      plateNumberEn: "SAB-1234",
      type: "Pickup Truck",
      typeAr: "شاحنة صغيرة",
      make: "Toyota",
      model: "Hilux",
      year: 2023,
      color: "White",
      colorAr: "أبيض",
      project: "aramco",
      client: "Saudi Aramco",
      driver: "Ahmed Al-Rashid",
      driverAr: "أحمد الراشد",
      driverPhone: "+966501234567",
      lastMaintenance: "2024-11-15",
      nextMaintenance: "2025-02-15",
      mileage: 45230,
      fuelConsumption: 12.5,
      status: "Active",
      dailyRate: 250,
      monthlyRate: 6000,
      location: "Riyadh - King Fahd Road",
      coordinates: "24.7136° N, 46.6753° E",
      insurance: "2025-08-15",
      registration: "2025-03-20",
      engineNumber: "TY123456789",
      chassisNumber: "CH987654321",
      fuelType: "Gasoline",
      capacity: "5 Passengers",
      documents: {
        registration: { uploaded: true, expiry: "2025-03-20", size: "2.1 MB" },
        insurance: { uploaded: true, expiry: "2025-08-15", size: "1.8 MB" },
        inspection: { uploaded: true, expiry: "2025-01-20", size: "1.2 MB" },
        driverLicense: { uploaded: true, expiry: "2026-05-10", size: "0.9 MB" },
      },
      maintenanceHistory: [
        {
          date: "2024-11-15",
          type: "Regular Service",
          cost: 850,
          description: "Oil change, filter replacement",
        },
        {
          date: "2024-08-20",
          type: "Tire Replacement",
          cost: 1200,
          description: "All four tires replaced",
        },
      ],
      fuelHistory: [
        { date: "2024-12-15", amount: 60, cost: 120, mileage: 45230 },
        { date: "2024-12-10", amount: 55, cost: 110, mileage: 44850 },
      ],
    },
    {
      id: 2,
      plateNumber: "س ب ج-5678",
      plateNumberEn: "SBJ-5678",
      type: "Heavy Truck",
      typeAr: "شاحنة ثقيلة",
      make: "Mercedes",
      model: "Actros",
      year: 2024,
      color: "Blue",
      colorAr: "أزرق",
      project: "sabic",
      client: "SABIC Industries",
      driver: "Mohammad Hassan",
      driverAr: "محمد حسن",
      driverPhone: "+966502345678",
      lastMaintenance: "2024-10-20",
      nextMaintenance: "2025-01-20",
      mileage: 78450,
      fuelConsumption: 28.3,
      status: "Active",
      dailyRate: 450,
      monthlyRate: 10800,
      location: "Jubail Industrial City",
      coordinates: "27.0174° N, 49.6251° E",
      insurance: "2025-06-10",
      registration: "2025-01-15",
      engineNumber: "MB987654321",
      chassisNumber: "CH123456789",
      fuelType: "Diesel",
      capacity: "25 Tons",
      documents: {
        registration: { uploaded: true, expiry: "2025-01-15", size: "2.3 MB" },
        insurance: { uploaded: true, expiry: "2025-06-10", size: "2.0 MB" },
        inspection: { uploaded: false, expiry: "2024-12-25", size: "0 MB" },
        driverLicense: { uploaded: true, expiry: "2025-12-15", size: "1.1 MB" },
      },
      maintenanceHistory: [
        {
          date: "2024-10-20",
          type: "Engine Service",
          cost: 2500,
          description: "Engine overhaul and inspection",
        },
      ],
      fuelHistory: [
        { date: "2024-12-14", amount: 120, cost: 240, mileage: 78450 },
      ],
    },
    {
      id: 3,
      plateNumber: "س ج د-9012",
      plateNumberEn: "SJD-9012",
      type: "Van",
      typeAr: "فان",
      make: "Ford",
      model: "Transit",
      year: 2023,
      color: "Silver",
      colorAr: "فضي",
      project: "neom",
      client: "NEOM Development",
      driver: "Ali Al-Mahmoud",
      driverAr: "علي المحمود",
      driverPhone: "+966503456789",
      lastMaintenance: "2024-12-01",
      nextMaintenance: "2024-12-20",
      mileage: 32100,
      fuelConsumption: 15.8,
      status: "Maintenance Due",
      dailyRate: 180,
      monthlyRate: 4320,
      location: "NEOM - Tabuk",
      coordinates: "28.2636° N, 34.7917° E",
      insurance: "2025-04-25",
      registration: "2025-02-28",
      engineNumber: "FD456789123",
      chassisNumber: "CH456789123",
      fuelType: "Gasoline",
      capacity: "12 Passengers",
      documents: {
        registration: { uploaded: true, expiry: "2025-02-28", size: "1.9 MB" },
        insurance: { uploaded: true, expiry: "2025-04-25", size: "1.7 MB" },
        inspection: { uploaded: true, expiry: "2025-03-15", size: "1.3 MB" },
        driverLicense: { uploaded: false, expiry: "2025-08-20", size: "0 MB" },
      },
      maintenanceHistory: [
        {
          date: "2024-12-01",
          type: "Brake Service",
          cost: 1200,
          description: "Brake pad replacement",
        },
      ],
      fuelHistory: [
        { date: "2024-12-13", amount: 45, cost: 90, mileage: 32100 },
      ],
    },
  ]);

  const [newVehicle, setNewVehicle] = useState({
    plateNumber: "",
    plateNumberEn: "",
    type: "Pickup Truck",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    colorAr: "",
    project: "aramco",
    driver: "",
    driverAr: "",
    driverPhone: "",
    dailyRate: 0,
    monthlyRate: 0,
    engineNumber: "",
    chassisNumber: "",
    fuelType: "Gasoline",
    capacity: "",
    insurance: "",
    registration: "",
  });

  const maintenanceSchedule = [
    {
      vehicleId: 1,
      plateNumber: "س أ ب-1234",
      type: "Regular Service",
      scheduledDate: "2024-12-20",
      description: "Oil change, filter replacement, general inspection",
      estimatedCost: 850,
      status: "Scheduled",
      priority: "Medium",
      assignedTechnician: "Hassan Al-Mechanic",
    },
    {
      vehicleId: 3,
      plateNumber: "س ج د-9012",
      type: "Brake Service",
      scheduledDate: "2024-12-18",
      description: "Brake pad replacement, brake fluid change",
      estimatedCost: 1200,
      status: "Overdue",
      priority: "High",
      assignedTechnician: "Ahmad Al-Technician",
    },
    {
      vehicleId: 2,
      plateNumber: "س ب ج-5678",
      type: "Tire Replacement",
      scheduledDate: "2024-12-25",
      description: "Replace front tires, wheel alignment",
      estimatedCost: 2400,
      status: "Scheduled",
      priority: "Medium",
      assignedTechnician: "Omar Al-Specialist",
    },
  ];

  const handleAddVehicle = () => {
    if (!newVehicle.plateNumber || !newVehicle.make || !newVehicle.model) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    const vehicle = {
      ...newVehicle,
      id: Math.max(...vehicles.map((v) => v.id)) + 1,
      client: projects.find((p) => p.id === newVehicle.project)?.nameEn || "",
      status: "Active",
      mileage: 0,
      fuelConsumption: 0,
      location: "Not Assigned",
      coordinates: "0° N, 0° E",
      lastMaintenance: "",
      nextMaintenance: "",
      typeAr: newVehicle.type,
      documents: {
        registration: {
          uploaded: false,
          expiry: newVehicle.registration,
          size: "0 MB",
        },
        insurance: {
          uploaded: false,
          expiry: newVehicle.insurance,
          size: "0 MB",
        },
        inspection: { uploaded: false, expiry: "", size: "0 MB" },
        driverLicense: { uploaded: false, expiry: "", size: "0 MB" },
      },
      maintenanceHistory: [],
      fuelHistory: [],
    };

    setVehicles([...vehicles, vehicle]);
    setNewVehicle({
      plateNumber: "",
      plateNumberEn: "",
      type: "Pickup Truck",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      colorAr: "",
      project: "aramco",
      driver: "",
      driverAr: "",
      driverPhone: "",
      dailyRate: 0,
      monthlyRate: 0,
      engineNumber: "",
      chassisNumber: "",
      fuelType: "Gasoline",
      capacity: "",
      insurance: "",
      registration: "",
    });
    setShowAddVehicle(false);
    alert(isArabic ? "تم إضافة المركبة بنجاح!" : "Vehicle added successfully!");
  };

  const handleExportVehicles = () => {
    try {
      const csvContent = [
        [
          "Plate Number",
          "Type",
          "Make",
          "Model",
          "Year",
          "Driver",
          "Project",
          "Status",
          "Daily Rate",
          "Monthly Rate",
          "Mileage",
          "Last Maintenance",
        ],
        ...filteredVehicles.map((vehicle) => [
          vehicle.plateNumber,
          vehicle.type,
          vehicle.make,
          vehicle.model,
          vehicle.year.toString(),
          vehicle.driver,
          vehicle.client,
          vehicle.status,
          vehicle.dailyRate.toString(),
          vehicle.monthlyRate.toString(),
          vehicle.mileage.toString(),
          vehicle.lastMaintenance,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `fleet_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم تصدير بيانات الأسطول بنجاح!"
          : "Fleet data exported successfully!"
      );
    } catch (error) {
      console.error("Export error:", error);
      alert(
        isArabic ? "حدث خطأ أثناء التصدير" : "Error occurred during export"
      );
    }
  };

  const handleGenerateMaintenanceReport = () => {
    try {
      let reportContent = "";
      reportContent += `AMOAGC AL-MAJMAAH - FLEET MAINTENANCE REPORT\n`;
      reportContent += `Generated on: ${new Date().toLocaleString()}\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      reportContent += `FLEET SUMMARY:\n`;
      reportContent += `Total Vehicles: ${vehicles.length}\n`;
      reportContent += `Active Vehicles: ${
        vehicles.filter((v) => v.status === "Active").length
      }\n`;
      reportContent += `Maintenance Due: ${
        vehicles.filter((v) => v.status === "Maintenance Due").length
      }\n`;
      reportContent += `Average Mileage: ${Math.round(
        vehicles.reduce((sum, v) => sum + v.mileage, 0) / vehicles.length
      ).toLocaleString()} km\n\n`;

      reportContent += `${"=".repeat(80)}\n`;
      reportContent += `VEHICLE DETAILS:\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      vehicles.forEach((vehicle, index) => {
        reportContent += `Vehicle ${index + 1}: ${vehicle.plateNumber}\n`;
        reportContent += `${"=".repeat(50)}\n`;
        reportContent += `Type:             ${vehicle.type}\n`;
        reportContent += `Make/Model:       ${vehicle.make} ${vehicle.model} (${vehicle.year})\n`;
        reportContent += `Driver:           ${vehicle.driver}\n`;
        reportContent += `Phone:            ${vehicle.driverPhone}\n`;
        reportContent += `Project:          ${vehicle.client}\n`;
        reportContent += `Status:           ${vehicle.status}\n`;
        reportContent += `Mileage:          ${vehicle.mileage.toLocaleString()} km\n`;
        reportContent += `Daily Rate:       ${vehicle.dailyRate} SAR\n`;
        reportContent += `Monthly Rate:     ${vehicle.monthlyRate} SAR\n`;
        reportContent += `Last Maintenance: ${
          vehicle.lastMaintenance || "Not recorded"
        }\n`;
        reportContent += `Next Maintenance: ${
          vehicle.nextMaintenance || "Not scheduled"
        }\n`;
        reportContent += `Location:         ${vehicle.location}\n`;
        reportContent += `Coordinates:      ${vehicle.coordinates}\n\n`;

        // Document status
        reportContent += `DOCUMENT STATUS:\n`;
        Object.entries(vehicle.documents).forEach(([docType, doc]) => {
          reportContent += `  ${docType}: ${
            doc.uploaded ? "✓ Uploaded" : "✗ Missing"
          } (Expires: ${doc.expiry})\n`;
        });
        reportContent += `\n`;

        // Maintenance history
        if (vehicle.maintenanceHistory.length > 0) {
          reportContent += `MAINTENANCE HISTORY:\n`;
          vehicle.maintenanceHistory.forEach((maintenance) => {
            reportContent += `  ${maintenance.date}: ${maintenance.type} - ${maintenance.cost} SAR\n`;
            reportContent += `    ${maintenance.description}\n`;
          });
        }
        reportContent += `\n`;
      });

      reportContent += `${"=".repeat(80)}\n`;
      reportContent += `MAINTENANCE SCHEDULE:\n`;
      reportContent += `${"=".repeat(80)}\n\n`;

      maintenanceSchedule.forEach((maintenance) => {
        reportContent += `${maintenance.plateNumber} - ${maintenance.type}\n`;
        reportContent += `  Scheduled: ${maintenance.scheduledDate}\n`;
        reportContent += `  Status: ${maintenance.status}\n`;
        reportContent += `  Priority: ${maintenance.priority}\n`;
        reportContent += `  Estimated Cost: ${maintenance.estimatedCost} SAR\n`;
        reportContent += `  Technician: ${maintenance.assignedTechnician}\n`;
        reportContent += `  Description: ${maintenance.description}\n\n`;
      });

      reportContent += `Report generated by: Fleet Management Department\n`;
      reportContent += `Date: ${new Date().toLocaleDateString()}\n`;

      const blob = new Blob([reportContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `fleet_maintenance_report_${new Date().toISOString().split("T")[0]}.txt`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        isArabic
          ? "تم إنشاء تقرير الصيانة بنجاح!"
          : "Maintenance report generated successfully!"
      );
    } catch (error) {
      console.error("Report generation error:", error);
      alert(
        isArabic
          ? "حدث خطأ أثناء إنشاء التقرير"
          : "Error occurred during report generation"
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Maintenance Due":
        return "bg-red-100 text-red-800 border-red-200";
      case "In Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesProject =
      selectedProject === "all" || vehicle.project === selectedProject;
    const matchesSearch =
      searchTerm === "" ||
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesProject && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "إدارة الأسطول المتقدمة" : "Advanced Fleet Management"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateMaintenanceReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            {isArabic ? "تقرير الصيانة" : "Maintenance Report"}
          </button>
          <button
            onClick={handleExportVehicles}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير البيانات" : "Export Data"}
          </button>
          <button
            onClick={() => setShowAddVehicle(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "إضافة مركبة" : "Add Vehicle"}
          </button>
        </div>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {vehicles.length}
              </div>
              <div className="text-sm text-gray-600">
                {isArabic ? "إجمالي المركبات" : "Total Vehicles"}
              </div>
            </div>
          </div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {vehicles.filter((v) => v.status === "Active").length}{" "}
            {isArabic ? "متاحة" : "Available"}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(
                  vehicles.reduce((sum, v) => sum + v.dailyRate, 0) / 1000
                ).toFixed(1)}
                K
              </div>
              <div className="text-sm text-gray-600">
                {isArabic ? "الإيرادات اليومية" : "Daily Revenue"}
              </div>
            </div>
          </div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {isArabic ? "+15% هذا الشهر" : "+15% This Month"}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {maintenanceSchedule.length}
              </div>
              <div className="text-sm text-gray-600">
                {isArabic ? "صيانة مجدولة" : "Scheduled Maintenance"}
              </div>
            </div>
          </div>
          <div className="text-xs text-yellow-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {
              maintenanceSchedule.filter((m) => m.status === "Overdue").length
            }{" "}
            {isArabic ? "متأخرة" : "Overdue"}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Fuel className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(
                  vehicles.reduce((sum, v) => sum + v.fuelConsumption, 0) /
                  vehicles.length
                ).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                {isArabic ? "متوسط الاستهلاك" : "Avg Fuel Consumption"}
              </div>
            </div>
          </div>
          <div className="text-xs text-blue-600 flex items-center gap-1">
            <Fuel className="w-3 h-3" />
            {isArabic ? "لتر/100كم" : "L/100km"}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {
                  vehicles.filter((v) => {
                    const expiringSoon =
                      new Date(v.insurance) <
                        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ||
                      new Date(v.registration) <
                        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                    return expiringSoon;
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600">
                {isArabic ? "تنبيهات الوثائق" : "Document Alerts"}
              </div>
            </div>
          </div>
          <div className="text-xs text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {isArabic ? "تنتهي قريباً" : "Expiring Soon"}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={
                isArabic
                  ? "البحث برقم اللوحة، السائق، أو نوع المركبة..."
                  : "Search by plate number, driver, or vehicle type..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {isArabic ? project.nameAr : project.nameEn}
              </option>
            ))}
          </select>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" />
            {isArabic ? "تصفية" : "Filter"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "vehicles"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                {isArabic ? "المركبات" : "Vehicles"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "maintenance"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                {isArabic ? "الصيانة" : "Maintenance"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "tracking"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {isArabic ? "التتبع" : "Tracking"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "documents"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isArabic ? "الوثائق" : "Documents"}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? "التحليلات" : "Analytics"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "vehicles" && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المركبة" : "Vehicle"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "رقم اللوحة" : "Plate Number"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "السائق" : "Driver"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المشروع" : "Project"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المسافة المقطوعة" : "Mileage"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المعدل اليومي" : "Daily Rate"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الحالة" : "Status"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vehicle.type} • {vehicle.year}
                            </div>
                            <div className="text-sm text-gray-500">
                              {isArabic ? vehicle.colorAr : vehicle.color}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-mono text-gray-900">
                          <div>{vehicle.plateNumber}</div>
                          <div className="text-xs text-gray-500">
                            {vehicle.plateNumberEn}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="font-medium">
                            {isArabic ? vehicle.driverAr : vehicle.driver}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {vehicle.driverPhone}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {vehicle.client}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div>{vehicle.mileage.toLocaleString()} km</div>
                          <div className="text-xs text-gray-500">
                            {vehicle.fuelConsumption} L/100km
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          <div>{vehicle.dailyRate} SAR</div>
                          <div className="text-xs text-gray-500">
                            {vehicle.monthlyRate} SAR/month
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                              vehicle.status
                            )}`}
                          >
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800 p-1 rounded transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-800 p-1 rounded transition-colors">
                              <Navigation className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800 p-1 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {isArabic ? "تنبيهات الصيانة" : "Maintenance Alerts"}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>
                      {
                        maintenanceSchedule.filter(
                          (m) => m.status === "Overdue"
                        ).length
                      }{" "}
                      {isArabic
                        ? "مركبات تحتاج صيانة عاجلة"
                        : "vehicles need urgent maintenance"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>
                      {
                        maintenanceSchedule.filter(
                          (m) => m.status === "Scheduled"
                        ).length
                      }{" "}
                      {isArabic
                        ? "مركبات صيانة مجدولة هذا الأسبوع"
                        : "vehicles scheduled for maintenance this week"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المركبة" : "Vehicle"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "نوع الصيانة" : "Maintenance Type"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "التاريخ المجدول" : "Scheduled Date"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "التكلفة المقدرة" : "Estimated Cost"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الفني المسؤول" : "Assigned Technician"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الأولوية" : "Priority"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الحالة" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {maintenanceSchedule.map((maintenance, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-mono text-gray-900">
                          {maintenance.plateNumber}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {maintenance.type}
                            </div>
                            <div className="text-sm text-gray-500">
                              {maintenance.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {maintenance.scheduledDate}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {maintenance.estimatedCost.toLocaleString()} SAR
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            {maintenance.assignedTechnician}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              maintenance.priority
                            )}`}
                          >
                            {maintenance.priority}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              maintenance.status === "Overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {maintenance.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "tracking" && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {isArabic ? "تتبع الأسطول المباشر" : "Live Fleet Tracking"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-white rounded-lg p-4 border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {vehicle.plateNumber}
                        </span>
                        <span
                          className={`w-3 h-3 rounded-full ${
                            vehicle.status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>
                            {isArabic ? vehicle.driverAr : vehicle.driver}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{vehicle.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          <span className="font-mono text-xs">
                            {vehicle.coordinates}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          {isArabic ? "آخر تحديث:" : "Last Update:"}{" "}
                          {isArabic ? "5 دقائق" : "5 min ago"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "خريطة الأسطول" : "Fleet Map"}
                </h3>
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>
                      {isArabic
                        ? "سيتم عرض خريطة تتبع الأسطول هنا"
                        : "Fleet tracking map will be displayed here"}
                    </p>
                    <p className="text-sm">
                      {isArabic
                        ? "تكامل مع نظام GPS"
                        : "GPS Integration Required"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {isArabic
                    ? "تنبيهات انتهاء الوثائق"
                    : "Document Expiry Alerts"}
                </h3>
                <div className="space-y-2 text-sm">
                  {vehicles.map((vehicle) => {
                    const expiringDocs = Object.entries(
                      vehicle.documents
                    ).filter(([_, doc]) => {
                      const expiryDate = new Date(doc.expiry);
                      const today = new Date();
                      const daysToExpiry = Math.ceil(
                        (expiryDate.getTime() - today.getTime()) /
                          (1000 * 3600 * 24)
                      );
                      return daysToExpiry <= 90 && daysToExpiry > 0;
                    });

                    return expiringDocs.map(([docType, doc]) => (
                      <div
                        key={`${vehicle.id}-${docType}`}
                        className="flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>
                          {vehicle.plateNumber} - {docType}{" "}
                          {isArabic ? "ينتهي في" : "expires on"} {doc.expiry}
                        </span>
                      </div>
                    ));
                  })}
                </div>
              </div>

              <div className="grid gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                      </h3>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        {isArabic ? "رفع وثيقة" : "Upload Document"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(vehicle.documents).map(
                        ([docType, doc]) => (
                          <div
                            key={docType}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900 capitalize">
                                {docType}
                              </span>
                              {doc.uploaded ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div>
                                {isArabic ? "الحالة:" : "Status:"}
                                <span
                                  className={`ml-1 ${
                                    doc.uploaded
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {doc.uploaded
                                    ? isArabic
                                      ? "مرفوع"
                                      : "Uploaded"
                                    : isArabic
                                    ? "مفقود"
                                    : "Missing"}
                                </span>
                              </div>
                              <div>
                                {isArabic ? "انتهاء الصلاحية:" : "Expiry:"}{" "}
                                {doc.expiry}
                              </div>
                              <div>
                                {isArabic ? "حجم الملف:" : "File Size:"}{" "}
                                {doc.size}
                              </div>
                            </div>
                            {doc.uploaded && (
                              <button className="mt-2 text-blue-600 hover:text-blue-800 text-xs">
                                {isArabic ? "عرض الملف" : "View File"}
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "استغلال الأسطول" : "Fleet Utilization"}
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      87.5%
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic
                        ? "معدل الاستغلال الشهري"
                        : "Monthly Utilization Rate"}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "تكلفة الصيانة" : "Maintenance Cost"}
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      24.5K
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "ريال هذا الشهر" : "SAR This Month"}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "كفاءة الوقود" : "Fuel Efficiency"}
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      18.9
                    </div>
                    <div className="text-sm text-gray-600">
                      {isArabic ? "لتر/100كم متوسط" : "L/100km Average"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "تحليلات متقدمة" : "Advanced Analytics"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية التفاعلية وتحليلات الأداء هنا..."
                    : "Interactive charts and performance analytics will be displayed here..."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إضافة مركبة جديدة" : "Add New Vehicle"}
              </h3>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "المعلومات الأساسية" : "Basic Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "رقم اللوحة (عربي)" : "Plate Number (Arabic)"}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      value={newVehicle.plateNumber}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          plateNumber: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="س أ ب-1234"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "رقم اللوحة (إنجليزي)"
                        : "Plate Number (English)"}{" "}
                      *
                    </label>
                    <input
                      type="text"
                      value={newVehicle.plateNumberEn}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          plateNumberEn: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="SAB-1234"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "نوع المركبة" : "Vehicle Type"} *
                    </label>
                    <select
                      value={newVehicle.type}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, type: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {vehicleTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "تفاصيل المركبة" : "Vehicle Details"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "الماركة" : "Make"} *
                    </label>
                    <input
                      type="text"
                      value={newVehicle.make}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, make: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Toyota"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "الموديل" : "Model"} *
                    </label>
                    <input
                      type="text"
                      value={newVehicle.model}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, model: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Hilux"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "سنة الصنع" : "Year"}
                    </label>
                    <input
                      type="number"
                      value={newVehicle.year}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          year:
                            parseInt(e.target.value) ||
                            new Date().getFullYear(),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "اللون" : "Color"}
                    </label>
                    <input
                      type="text"
                      value={newVehicle.color}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, color: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="White"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "المواصفات التقنية" : "Technical Specifications"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "رقم المحرك" : "Engine Number"}
                    </label>
                    <input
                      type="text"
                      value={newVehicle.engineNumber}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          engineNumber: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="TY123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "رقم الشاسيه" : "Chassis Number"}
                    </label>
                    <input
                      type="text"
                      value={newVehicle.chassisNumber}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          chassisNumber: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="CH987654321"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "نوع الوقود" : "Fuel Type"}
                    </label>
                    <select
                      value={newVehicle.fuelType}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          fuelType: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Assignment & Rates */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "التخصيص والأسعار" : "Assignment & Rates"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "المشروع" : "Project"}
                    </label>
                    <select
                      value={newVehicle.project}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          project: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {projects
                        .filter((p) => p.id !== "all")
                        .map((project) => (
                          <option key={project.id} value={project.id}>
                            {isArabic ? project.nameAr : project.nameEn}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "المعدل اليومي (ريال)" : "Daily Rate (SAR)"}
                    </label>
                    <input
                      type="number"
                      value={newVehicle.dailyRate}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          dailyRate: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "المعدل الشهري (ريال)" : "Monthly Rate (SAR)"}
                    </label>
                    <input
                      type="number"
                      value={newVehicle.monthlyRate}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          monthlyRate: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="6000"
                    />
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "معلومات السائق" : "Driver Information"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic
                        ? "اسم السائق (إنجليزي)"
                        : "Driver Name (English)"}
                    </label>
                    <input
                      type="text"
                      value={newVehicle.driver}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, driver: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Ahmed Al-Rashid"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "اسم السائق (عربي)" : "Driver Name (Arabic)"}
                    </label>
                    <input
                      type="text"
                      value={newVehicle.driverAr}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          driverAr: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="أحمد الراشد"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "رقم هاتف السائق" : "Driver Phone"}
                    </label>
                    <input
                      type="tel"
                      value={newVehicle.driverPhone}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          driverPhone: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="+966501234567"
                    />
                  </div>
                </div>
              </div>

              {/* Document Expiry Dates */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "تواريخ انتهاء الوثائق" : "Document Expiry Dates"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "انتهاء التأمين" : "Insurance Expiry"}
                    </label>
                    <input
                      type="date"
                      value={newVehicle.insurance}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          insurance: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? "انتهاء التسجيل" : "Registration Expiry"}
                    </label>
                    <input
                      type="date"
                      value={newVehicle.registration}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          registration: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAddVehicle}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ المركبة" : "Save Vehicle"}
                </button>
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
