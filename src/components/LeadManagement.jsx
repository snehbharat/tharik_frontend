import React, { useState, useEffect } from "react";
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
import LeadService from "../services/LeadService";

export const LeadManagement = ({ isArabic }) => {
  const [activeView, setActiveView] = useState("pipeline");
  const [showAddLead, setShowAddLead] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [draggedLead, setDraggedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewLead, setViewLead] = useState(null);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [pipelineStages, setPipelineStages] = useState([
    {
      id: "Prospect",
      name: "Prospect",
      nameAr: "عميل محتمل",
      color: "#6b7280",
      order: 1,
      leads: [],
      conversionRate: 25,
      averageTime: 7,
    },
    {
      id: "Qualified",
      name: "Qualified",
      nameAr: "مؤهل",
      color: "#3b82f6",
      order: 2,
      leads: [],
      conversionRate: 45,
      averageTime: 14,
    },
    {
      id: "Proposal",
      name: "Proposal",
      nameAr: "اقتراح",
      color: "#f59e0b",
      order: 3,
      leads: [],
      conversionRate: 65,
      averageTime: 21,
    },
    {
      id: "Negotiation",
      name: "Negotiation",
      nameAr: "تفاوض",
      color: "#ef4444",
      order: 4,
      leads: [],
      conversionRate: 80,
      averageTime: 10,
    },
    {
      id: "Won",
      name: "Won",
      nameAr: "فوز",
      color: "#10b981",
      order: 5,
      leads: [],
      conversionRate: 100,
      averageTime: 0,
    },
  ]);

  // const [leads, setLeads] = useState([
  //   {
  //     id: 1,
  //     name: "Ahmed Al-Mansouri",
  //     nameAr: "أحمد المنصوري",
  //     company: "Saudi Aramco",
  //     companyAr: "أرامكو السعودية",
  //     email: "ahmed@aramco.com",
  //     phone: "+966501234567",
  //     source: "Website",
  //     stage: "qualified",
  //     value: 1200000,
  //     probability: 75,
  //     assignedTo: "Sales Manager",
  //     createdDate: "2024-12-01",
  //     lastContact: "2024-12-14",
  //     nextFollowUp: "2024-12-18",
  //     notes: "Interested in long-term maintenance contract",
  //     priority: "High",
  //     status: "Qualified",
  //   },
  //   {
  //     id: 2,
  //     name: "Fatima Al-Zahra",
  //     nameAr: "فاطمة الزهراء",
  //     company: "SABIC Industries",
  //     companyAr: "صناعات سابك",
  //     email: "fatima@sabic.com",
  //     phone: "+966502345678",
  //     source: "Referral",
  //     stage: "proposal",
  //     value: 850000,
  //     probability: 60,
  //     assignedTo: "Senior Sales Rep",
  //     createdDate: "2024-11-15",
  //     lastContact: "2024-12-13",
  //     nextFollowUp: "2024-12-20",
  //     notes: "Requires detailed proposal for construction support",
  //     priority: "Medium",
  //     status: "Proposal",
  //   },
  //   {
  //     id: 3,
  //     name: "Mohammad Hassan",
  //     nameAr: "محمد حسن",
  //     company: "NEOM Development",
  //     companyAr: "تطوير نيوم",
  //     email: "mohammad@neom.sa",
  //     phone: "+966503456789",
  //     source: "Cold Call",
  //     stage: "negotiation",
  //     value: 2100000,
  //     probability: 85,
  //     assignedTo: "Sales Director",
  //     createdDate: "2024-10-20",
  //     lastContact: "2024-12-15",
  //     nextFollowUp: "2024-12-17",
  //     notes: "Final contract negotiations in progress",
  //     priority: "Urgent",
  //     status: "Negotiation",
  //   },
  //   {
  //     id: 4,
  //     name: "Ali Al-Rashid",
  //     nameAr: "علي الراشد",
  //     company: "Royal Commission",
  //     companyAr: "الهيئة الملكية",
  //     email: "ali@rcjy.gov.sa",
  //     phone: "+966504567890",
  //     source: "Trade Show",
  //     stage: "prospect",
  //     value: 650000,
  //     probability: 30,
  //     assignedTo: "Junior Sales Rep",
  //     createdDate: "2024-12-10",
  //     lastContact: "2024-12-12",
  //     nextFollowUp: "2024-12-19",
  //     notes: "Initial interest in fleet management services",
  //     priority: "Low",
  //     status: "Active",
  //   },
  // ]);

  const fetchLeads = async (page = 1) => {
    try {
      setLoading(true);
      const res = await LeadService.getAllLeads(page, pagination.limit);
      // console.log("res", res);

      setLeads(res?.data?.data || []);
      setPagination({
        total: res?.data?.total || 0,
        page: res?.data?.page || 1,
        limit: res?.data?.limit || 10,
        totalPages: res?.data?.totalPages || 1,
      });
    } catch (err) {
      console.error("Error fetching leads:", err.message);
      setError("Failed to load lead");
    } finally {
      setLoading(false);
    }
  };
  // console.log("leads", leads);

  useEffect(() => {
    fetchLeads();
  }, []);

  // Organize leads by stage
  const organizeLeadsByStage = () => {
    const organizedStages = pipelineStages.map((stage) => ({
      ...stage,
      leads: leads.filter(
        (lead) => lead.stage?.toLowerCase() === stage.id.toLowerCase()
      ),
    }));
    setPipelineStages(organizedStages);
  };

  useEffect(() => {
    organizeLeadsByStage();
  }, [leads]);

  const handleDragStart = (lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStageId) => {
    e.preventDefault();
    if (draggedLead) {
      try {
        // Find the target stage
        const targetStage = pipelineStages.find(
          (stage) => stage.id === targetStageId
        );

        // Update backend: stage + probability (conversionRate of target stage)
        await LeadService.updateLead(draggedLead._id, {
          stage: targetStageId,
          probability: targetStage?.conversionRate || 0,
        });

        // Update state locally
        const updatedLeads = leads.map((lead) =>
          lead._id === draggedLead._id
            ? {
                ...lead,
                stage: targetStageId,
                probability: targetStage?.conversionRate || lead.probability,
              }
            : lead
        );
        setLeads(updatedLeads);

        // Reorganize pipeline
        organizeLeadsByStage();

        setDraggedLead(null);
      } catch (error) {
        console.error("Failed to update lead stage:", error);
      }
    }
  };

  const [newLead, setNewLead] = useState({
    name: "",
    nameAr: "",
    company: "",
    companyAr: "",
    email: "",
    phone: "",
    source: "Website",
    stage: "Prospect",
    value: 0,
    probability: 25,
    assignedTo: "",
    notes: "",
    priority: "Medium",
    status: "Active",
    nextFollowUp: "",
  });

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.company || !newLead.email) {
      alert(
        isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields"
      );
      return;
    }

    const vehiclePayload = {
      name: newLead.name,
      name_arb: newLead.nameAr,
      company: newLead.company,
      company_arb: newLead.companyAr,
      email: newLead.email,
      phone: newLead.phone,
      source: newLead.source,
      stage: newLead.stage,
      value: newLead.value,
      probability: newLead.probability,
      assigned_to: newLead.assignedTo,
      notes: newLead.notes,
      priority: newLead.priority,
      status: newLead.status,
      next_follow_up: newLead.nextFollowUp,
    };

    try {
      const created_date = new Date().toISOString();
      // console.log("created data", created_date);

      await LeadService.createLead({
        ...vehiclePayload,
        created_date,
        last_contact: created_date,
      });

      await fetchLeads(pagination.page);

      // reset form
      setNewLead({
        name: "",
        nameAr: "",
        company: "",
        companyAr: "",
        email: "",
        phone: "",
        source: "Website",
        stage: "Prospect",
        value: 0,
        probability: 25,
        assignedTo: "",
        notes: "",
        priority: "Medium",
        status: "Active",
        nextFollowUp: "",
      });

      setShowAddLead(false);
      alert(
        isArabic ? "تم إضافة العميل المحتمل بنجاح!" : "Lead added successfully!"
      );
    } catch (error) {
      console.error("Error creating lead:", error);
      alert(isArabic ? "فشل في إضافة العميل المحتمل" : "Failed to add lead");
    }
  };

  const handleEditLead = (id) => {
    const lead = leads.find((l) => l._id === id);
    if (!lead) return;
    setEditingLead(lead);
  };

  const handleSaveLead = async () => {
    if (!editingLead) return;

    try {
      const payload = {
        name: editingLead.name,
        name_arb: editingLead.name_arb,
        company: editingLead.company,
        company_arb: editingLead.company_arb,
        email: editingLead.email,
        phone: editingLead.phone,
        source: editingLead.source,
        stage: editingLead.stage,
        value: Number(editingLead.value),
        probability: Number(editingLead.probability),
        assigned_to: editingLead.assigned_to,
        notes: editingLead.notes,
        priority: editingLead.priority,
        status: editingLead.status,
        next_follow_up: editingLead.next_follow_up,
      };

      const res = await LeadService.updateLead(editingLead._id, payload);

      if (res?.status === 200) {
        await fetchLeads(pagination.page);
        setEditingLead(null);
        alert(
          isArabic
            ? "تم تحديث العميل المحتمل بنجاح!"
            : "Lead updated successfully!"
        );
      }
    } catch (err) {
      setError("Failed to update lead");
      console.error("Error updating lead:", err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    if (
      window.confirm(
        isArabic
          ? "هل أنت متأكد من حذف هذا العميل المحتمل؟"
          : "Are you sure you want to delete this lead?"
      )
    ) {
      const res = await LeadService.deleteLead(id);
      if (res?.status === 200) {
        fetchLeads(pagination.page);
      }
      alert(
        isArabic ? "تم حذف العميل المحتمل بنجاح!" : "Lead deleted successfully!"
      );
    }
  };

  const handleViewLead = (id) => {
    const lead = leads.find((l) => l._id === id);
    setViewLead(lead);
    // console.log("Viewing lead:", lead);
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
                {leads.filter((l) => l.stage === "Won").length}
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
                                {isArabic ? lead.name_arb : lead.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {isArabic ? lead.company_arb : lead.company}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditLead(lead._id)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead._id)}
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
                                {lead.next_follow_up
                                  ? new Date(
                                      lead.next_follow_up
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "—"}
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
                        : "Search leads by name, company or email..."
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
                      <tr key={lead._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {isArabic ? lead.name_arb : lead.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {isArabic ? lead.company_arb : lead.company}
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
                                isArabic ? "name_arb" : "name"
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
                          {lead.next_follow_up
                            ? new Date(lead.next_follow_up).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewLead(lead._id)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                              aria-label={`${isArabic ? "عرض" : "View"} ${
                                lead.name
                              }`}
                            >
                              <Eye className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleEditLead(lead._id)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead._id)}
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

              {/* <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? "تحليلات متقدمة" : "Advanced Analytics"}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic
                    ? "سيتم عرض الرسوم البيانية التفاعلية وتحليلات الأداء هنا..."
                    : "Interactive charts and performance analytics will be displayed here..."}
                </div>
              </div> */}
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
                    onChange={(e) => {
                      const selectedStage = pipelineStages.find(
                        (stage) => stage.id === e.target.value
                      );
                      setNewLead({
                        ...newLead,
                        stage: e.target.value,
                        probability: selectedStage
                          ? selectedStage.conversionRate
                          : 0,
                      });
                    }}
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

              <div className="grid grid-cols-3 gap-4">
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
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "انتهاء التأمين" : "Next FollowUp"}
                  </label>
                  <input
                    type="date"
                    value={newLead.nextFollowUp}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        nextFollowUp: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-semibold mb-4">
              {isArabic ? "تعديل العميل المحتمل" : "Edit Lead"}
            </h2>
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
                    value={editingLead.name_arb}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        name_arb: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الشركة (إنجليزي)" : "Company (English)"}
                  </label>
                  <input
                    type="text"
                    value={editingLead.company}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        company: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الشركة (عربي)" : "Company (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingLead.company_arb}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        company_arb: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={editingLead.email}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "رقم الهاتف" : "Phone"}
                  </label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Source + Stage */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المصدر" : "Source"}
                  </label>
                  <select
                    value={editingLead.source}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, source: e.target.value })
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
                    value={editingLead.stage}
                    onChange={(e) => {
                      const selectedStage = pipelineStages.find(
                        (stage) => stage.id === e.target.value
                      );
                      setEditingLead({
                        ...editingLead,
                        stage: e.target.value,
                        probability: selectedStage
                          ? selectedStage.conversionRate
                          : 0,
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {pipelineStages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {isArabic ? stage.nameAr : stage.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Value + Probability */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "القيمة" : "Value"}
                  </label>
                  <input
                    type="number"
                    value={editingLead.value}
                    onChange={(e) =>
                      setEditingLead({ ...editingLead, value: e.target.value })
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
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Assigned To + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "المسند إليه" : "Assigned To"}
                  </label>
                  <input
                    type="text"
                    value={editingLead.assigned_to}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        assigned_to: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
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
                    <option value="High">{isArabic ? "عالية" : "High"}</option>
                    <option value="Medium">
                      {isArabic ? "متوسطة" : "Medium"}
                    </option>
                    <option value="Low">{isArabic ? "منخفضة" : "Low"}</option>
                  </select>
                </div>
              </div>

              {/* Next Follow Up */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? "المتابعة القادمة" : "Next Follow Up"}
                </label>
                <input
                  type="date"
                  value={
                    editingLead.next_follow_up
                      ? new Date(editingLead.next_follow_up)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setEditingLead({
                      ...editingLead,
                      next_follow_up: new Date(newDate).toISOString(),
                      last_contact: new Date().toISOString(),
                    });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Notes */}
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
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setEditingLead(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleSaveLead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {isArabic ? "حفظ" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* view Lead Modal */}
      {viewLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isArabic ? "تفاصيل العميل المحتمل" : "Lead Details"}
              </h3>
              <button
                onClick={() => setViewLead(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Lead Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: isArabic ? "الاسم (إنجليزي)" : "Name (English)",
                  value: viewLead.name,
                },
                {
                  label: isArabic ? "الاسم (عربي)" : "Name (Arabic)",
                  value: viewLead.name_arb,
                },
                {
                  label: isArabic ? "الشركة (إنجليزي)" : "Company (English)",
                  value: viewLead.company,
                },
                {
                  label: isArabic ? "الشركة (عربي)" : "Company (Arabic)",
                  value: viewLead.company_arb,
                },
                {
                  label: isArabic ? "البريد الإلكتروني" : "Email",
                  value: viewLead.email,
                },
                {
                  label: isArabic ? "رقم الهاتف" : "Phone",
                  value: viewLead.phone,
                },
                {
                  label: isArabic ? "الحالة" : "Status",
                  value: viewLead.status,
                },
                {
                  label: isArabic ? "الأولوية" : "Priority",
                  value: viewLead.priority,
                },
                {
                  label: isArabic ? "المصدر" : "Source",
                  value: viewLead.source,
                },
                {
                  label: isArabic ? "المرحلة" : "Stage",
                  value: viewLead.stage,
                },
                {
                  label: isArabic ? "الاحتمالية (%)" : "Probability (%)",
                  value: viewLead.probability,
                },
                {
                  label: isArabic ? "القيمة" : "Value",
                  value: viewLead.value,
                },
                {
                  label: isArabic ? "المخصص لـ" : "Assigned To",
                  value: viewLead.assigned_to,
                },
                {
                  label: isArabic ? "آخر تواصل" : "Last Contact",
                  value: viewLead.last_contact
                    ? new Date(viewLead.last_contact)
                        .toISOString()
                        .split("T")[0]
                    : "-",
                },
                {
                  label: isArabic ? "المتابعة القادمة" : "Next Follow-up",
                  value: viewLead.next_follow_up
                    ? new Date(viewLead.next_follow_up)
                        .toISOString()
                        .split("T")[0]
                    : "-",
                },
                {
                  label: isArabic ? "تاريخ الإنشاء" : "Created At",
                  value: viewLead.created_at
                    ? new Date(viewLead.created_at).toISOString().split("T")[0]
                    : "-",
                },
                {
                  label: isArabic ? "تاريخ التحديث" : "Updated At",
                  value: viewLead.updated_at
                    ? new Date(viewLead.updated_at).toISOString().split("T")[0]
                    : "-",
                },
                {
                  label: isArabic ? "ملاحظات" : "Notes",
                  value: viewLead.notes,
                },
              ].map((field, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <span className="text-sm text-gray-500 mb-1">
                    {field.label}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {field.value || "-"}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewLead(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
