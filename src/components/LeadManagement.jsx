import React, { useState } from "react";
import {
  Target,
  Users,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Eye,
  Trash2,
  Save,
  X,
  Download,
  Upload,
  Filter,
  Search,
  Bell,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";

export const LeadManagement = ({ isArabic }) => {
  const [activeView, setActiveView] = useState("pipeline");
  const [showAddLead, setShowAddLead] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [draggedLead, setDraggedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");

  const [pipelineStages, setPipelineStages] = useState([
    {
      id: "prospect",
      name: "Prospect",
      nameAr: "عميل محتمل",
      color: "#6b7280",
      order: 1,
      leads: [],
      conversionRate: 25,
      averageTime: 7,
    },
    {
      id: "qualified",
      name: "Qualified",
      nameAr: "مؤهل",
      color: "#3b82f6",
      order: 2,
      leads: [],
      conversionRate: 45,
      averageTime: 14,
    },
    {
      id: "proposal",
      name: "Proposal",
      nameAr: "اقتراح",
      color: "#f59e0b",
      order: 3,
      leads: [],
      conversionRate: 65,
      averageTime: 21,
    },
    {
      id: "negotiation",
      name: "Negotiation",
      nameAr: "تفاوض",
      color: "#ef4444",
      order: 4,
      leads: [],
      conversionRate: 80,
      averageTime: 10,
    },
    {
      id: "won",
      name: "Won",
      nameAr: "فوز",
      color: "#10b981",
      order: 5,
      leads: [],
      conversionRate: 100,
      averageTime: 0,
    },
  ]);

  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Ahmed Al-Mansouri",
      nameAr: "أحمد المنصوري",
      company: "Saudi Aramco",
      companyAr: "أرامكو السعودية",
      email: "ahmed@aramco.com",
      phone: "+966501234567",
      source: "Website",
      stage: "qualified",
      value: 1200000,
      probability: 75,
      assignedTo: "Sales Manager",
      createdDate: "2024-12-01",
      lastContact: "2024-12-14",
      nextFollowUp: "2024-12-18",
      notes: "Interested in long-term maintenance contract",
      priority: "High",
      status: "Qualified",
    },
    {
      id: 2,
      name: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      company: "SABIC Industries",
      companyAr: "صناعات سابك",
      email: "fatima@sabic.com",
      phone: "+966502345678",
      source: "Referral",
      stage: "proposal",
      value: 850000,
      probability: 60,
      assignedTo: "Senior Sales Rep",
      createdDate: "2024-11-15",
      lastContact: "2024-12-13",
      nextFollowUp: "2024-12-20",
      notes: "Requires detailed proposal for construction support",
      priority: "Medium",
      status: "Proposal",
    },
    {
      id: 3,
      name: "Mohammad Hassan",
      nameAr: "محمد حسن",
      company: "NEOM Development",
      companyAr: "تطوير نيوم",
      email: "mohammad@neom.sa",
      phone: "+966503456789",
      source: "Cold Call",
      stage: "negotiation",
      value: 2100000,
      probability: 85,
      assignedTo: "Sales Director",
      createdDate: "2024-10-20",
      lastContact: "2024-12-15",
      nextFollowUp: "2024-12-17",
      notes: "Final contract negotiations in progress",
      priority: "Urgent",
      status: "Negotiation",
    },
    {
      id: 4,
      name: "Ali Al-Rashid",
      nameAr: "علي الراشد",
      company: "Royal Commission",
      companyAr: "الهيئة الملكية",
      email: "ali@rcjy.gov.sa",
      phone: "+966504567890",
      source: "Trade Show",
      stage: "prospect",
      value: 650000,
      probability: 30,
      assignedTo: "Junior Sales Rep",
      createdDate: "2024-12-10",
      lastContact: "2024-12-12",
      nextFollowUp: "2024-12-19",
      notes: "Initial interest in fleet management services",
      priority: "Low",
      status: "Active",
    },
  ]);

  const [newLead, setNewLead] = useState({
    name: "",
    nameAr: "",
    company: "",
    companyAr: "",
    email: "",
    phone: "",
    source: "Website",
    stage: "prospect",
    value: 0,
    probability: 25,
    assignedTo: "",
    notes: "",
    priority: "Medium",
    status: "Active",
  });
  // Organize leads by stage
  const organizeLeadsByStage = () => {
    const organizedStages = pipelineStages.map((stage) => ({
      ...stage,
      leads: leads.filter((lead) => lead.stage === stage.id),
    }));
    setPipelineStages(organizedStages);
  };

  React.useEffect(() => {
    organizeLeadsByStage();
  }, [leads]);

  const handleDragStart = (lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    if (draggedLead) {
      const updatedLeads = leads.map((lead) =>
        lead.id === draggedLead.id ? { ...lead, stage: targetStageId } : lead
      );
      setLeads(updatedLeads);
      setDraggedLead(null);
    }
  };

  const handleAddLead = () => {
    if (!newLead.name || !newLead.company || !newLead.email) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    const lead = {
      ...newLead,
      id: Math.max(...leads.map((l) => l.id)) + 1,
      createdDate: new Date().toISOString().split("T")[0],
      lastContact: new Date().toISOString().split("T")[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    setLeads([...leads, lead]);
    setNewLead({
      name: "",
      nameAr: "",
      company: "",
      companyAr: "",
      email: "",
      phone: "",
      source: "Website",
      stage: "prospect",
      value: 0,
      probability: 25,
      assignedTo: "",
      notes: "",
      priority: "Medium",
      status: "Active",
    });
    setShowAddLead(false);
    alert(
      isArabic ? "تم إضافة العميل المحتمل بنجاح!" : "Lead added successfully!"
    );
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
  };

  const handleSaveLead = () => {
    if (editingLead) {
      const updatedLeads = leads.map((lead) =>
        lead.id === editingLead.id ? editingLead : lead
      );
      setLeads(updatedLeads);
      setEditingLead(null);
      alert(
        isArabic ? "تم حفظ التغييرات بنجاح!" : "Changes saved successfully!"
      );
    }
  };

  const handleDeleteLead = (id) => {
    if (
      window.confirm(
        isArabic
          ? "هل أنت متأكد من حذف هذا العميل المحتمل؟"
          : "Are you sure you want to delete this lead?"
      )
    ) {
      setLeads(leads.filter((lead) => lead.id !== id));
      alert(
        isArabic ? "تم حذف العميل المحتمل بنجاح!" : "Lead deleted successfully!"
      );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} SAR`;
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === "all" || lead.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const weightedPipelineValue = leads.reduce(
    (sum, lead) => sum + (lead.value * lead.probability) / 100,
    0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? "إدارة العملاء المحتملين" : "Lead Management"}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            {isArabic ? "تصدير العملاء" : "Export Leads"}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            {isArabic ? "استيراد العملاء" : "Import Leads"}
          </button>
          <button
            onClick={() => setShowAddLead(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? "إضافة عميل محتمل" : "Add Lead"}
          </button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {leads.length}
              </div>
              <div className="text-sm text-blue-700">
                {isArabic ? "إجمالي العملاء" : "Total Leads"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {(totalPipelineValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-green-700">
                {isArabic ? "قيمة الأنبوب" : "Pipeline Value"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {(weightedPipelineValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-purple-700">
                {isArabic ? "القيمة المرجحة" : "Weighted Value"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {leads.filter((l) => l.stage === "won").length}
              </div>
              <div className="text-sm text-yellow-700">
                {isArabic ? "صفقات مغلقة" : "Deals Won"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveView("pipeline")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "pipeline"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? "الأنبوب المرئي" : "Visual Pipeline"}
              </div>
            </button>
            <button
              onClick={() => setActiveView("list")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "list"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {isArabic ? "قائمة العملاء" : "Lead List"}
              </div>
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeView === "analytics"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isArabic ? "التحليلات" : "Analytics"}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeView === "pipeline" && (
            <div className="space-y-6">
              {/* Pipeline Stages */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {pipelineStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="bg-gray-50 rounded-lg p-4 min-h-[600px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    {/* Stage Header */}
                    <div className="mb-4">
                      <div
                        className="flex items-center gap-2 mb-2"
                        style={{ color: stage.color }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        ></div>
                        <h3 className="font-semibold text-sm">
                          {isArabic ? stage.nameAr : stage.name}
                        </h3>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                          {stage.leads.length}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {stage.conversionRate}%{" "}
                        {isArabic ? "معدل التحويل" : "conversion"} •
                        {stage.averageTime} {isArabic ? "يوم" : "days avg"}
                      </div>
                    </div>

                    {/* Stage Leads */}
                    <div className="space-y-3">
                      {stage.leads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => handleDragStart(lead)}
                          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm cursor-move hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">
                                {isArabic ? lead.nameAr : lead.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {isArabic ? lead.companyAr : lead.company}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditLead(lead)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">
                                {isArabic ? "القيمة:" : "Value:"}
                              </span>
                              <span className="text-xs font-medium">
                                {formatCurrency(lead.value)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">
                                {isArabic ? "الاحتمالية:" : "Probability:"}
                              </span>
                              <span className="text-xs font-medium">
                                {lead.probability}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">
                                {isArabic ? "المتابعة:" : "Follow-up:"}
                              </span>
                              <span className="text-xs">
                                {lead.nextFollowUp}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                                lead.priority
                              )}`}
                            >
                              {lead.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "list" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      isArabic
                        ? "البحث في العملاء المحتملين..."
                        : "Search leads..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="all">
                    {isArabic ? "جميع المراحل" : "All Stages"}
                  </option>
                  {pipelineStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {isArabic ? stage.nameAr : stage.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Leads Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "العميل المحتمل" : "Lead"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المرحلة" : "Stage"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "القيمة" : "Value"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الاحتمالية" : "Probability"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "المتابعة التالية" : "Next Follow-up"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {isArabic ? lead.nameAr : lead.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {isArabic ? lead.companyAr : lead.company}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.email} • {lead.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                            style={{
                              backgroundColor:
                                pipelineStages.find((s) => s.id === lead.stage)
                                  ?.color || "#6b7280",
                            }}
                          >
                            {
                              pipelineStages.find((s) => s.id === lead.stage)?.[
                                isArabic ? "nameAr" : "name"
                              ]
                            }
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(lead.value)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${lead.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{lead.probability}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {lead.nextFollowUp}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditLead(lead)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                            >
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

          {activeView === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "معدلات التحويل" : "Conversion Rates"}
                  </h3>
                  <div className="space-y-3">
                    {pipelineStages.map((stage) => (
                      <div
                        key={stage.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-600">
                          {isArabic ? stage.nameAr : stage.name}:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${stage.conversionRate}%`,
                                backgroundColor: stage.color,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {stage.conversionRate}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isArabic ? "متوسط وقت المرحلة" : "Average Stage Time"}
                  </h3>
                  <div className="space-y-3">
                    {pipelineStages.map((stage) => (
                      <div
                        key={stage.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-600">
                          {isArabic ? stage.nameAr : stage.name}:
                        </span>
                        <span className="font-semibold">
                          {stage.averageTime} {isArabic ? "يوم" : "days"}
                        </span>
                      </div>
                    ))}
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

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "إضافة عميل محتمل جديد" : "Add New Lead"}
              </h3>
              <button
                onClick={() => setShowAddLead(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"} *
                  </label>
                  <input
                    type="text"
                    value={newLead.name}
                    onChange={(e) =>
                      setNewLead({ ...newLead, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={newLead.nameAr}
                    onChange={(e) =>
                      setNewLead({ ...newLead, nameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الشركة (إنجليزي)" : "Company (English)"} *
                  </label>
                  <input
                    type="text"
                    value={newLead.company}
                    onChange={(e) =>
                      setNewLead({ ...newLead, company: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الشركة (عربي)" : "Company (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={newLead.companyAr}
                    onChange={(e) =>
                      setNewLead({ ...newLead, companyAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"} *
                  </label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) =>
                      setNewLead({ ...newLead, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={newLead.phone}
                    onChange={(e) =>
                      setNewLead({ ...newLead, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المصدر" : "Source"}
                  </label>
                  <select
                    value={newLead.source}
                    onChange={(e) =>
                      setNewLead({ ...newLead, source: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Social Media">Social Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المرحلة" : "Stage"}
                  </label>
                  <select
                    value={newLead.stage}
                    onChange={(e) =>
                      setNewLead({ ...newLead, stage: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {pipelineStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {isArabic ? stage.nameAr : stage.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الأولوية" : "Priority"}
                  </label>
                  <select
                    value={newLead.priority}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        priority: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic
                      ? "القيمة المتوقعة (ريال)"
                      : "Expected Value (SAR)"}
                  </label>
                  <input
                    type="number"
                    value={newLead.value}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        value: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاحتمالية (%)" : "Probability (%)"}
                  </label>
                  <input
                    type="number"
                    value={newLead.probability}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        probability: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المسؤول" : "Assigned To"}
                </label>
                <input
                  type="text"
                  value={newLead.assignedTo}
                  onChange={(e) =>
                    setNewLead({ ...newLead, assignedTo: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "ملاحظات" : "Notes"}
                </label>
                <textarea
                  value={newLead.notes}
                  onChange={(e) =>
                    setNewLead({ ...newLead, notes: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleAddLead}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ العميل المحتمل" : "Save Lead"}
                </button>
                <button
                  onClick={() => setShowAddLead(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? "تعديل العميل المحتمل" : "Edit Lead"}
              </h3>
              <button
                onClick={() => setEditingLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={editingLead.name}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاسم (عربي)" : "Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingLead.nameAr}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, nameAr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "القيمة المتوقعة" : "Expected Value"}
                  </label>
                  <input
                    type="number"
                    value={editingLead.value}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        value: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الاحتمالية (%)" : "Probability (%)"}
                  </label>
                  <input
                    type="number"
                    value={editingLead.probability}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        probability: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المرحلة" : "Stage"}
                  </label>
                  <select
                    value={editingLead.stage}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, stage: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {pipelineStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {isArabic ? stage.nameAr : stage.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الأولوية" : "Priority"}
                  </label>
                  <select
                    value={editingLead.priority}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        priority: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "ملاحظات" : "Notes"}
                </label>
                <textarea
                  value={editingLead.notes}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, notes: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSaveLead}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? "حفظ التغييرات" : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingLead(null)}
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
