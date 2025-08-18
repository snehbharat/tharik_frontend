import React, { useEffect, useState } from "react";
import { Download, Search, Filter, Users, Shield, X, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PermissionsPage({ isArabic }) {
  const [allPermissions, setAllPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterPermission, setFilterPermission] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const usersPerPage = 10;

  const fetchPermissions = async () => {
    try {
      const permsResponse = await fetch("/api/permission/all");
      const permsData = await permsResponse.json();
      const perms = Array.isArray(permsData.data) ? permsData.data : [];
      setAllPermissions(perms);

      const userResponse = await fetch("/api/user/permission/getUserWithPermission");
      const userData = await userResponse.json();
      const apiData = userData.data || [];

      const formattedUsers = apiData.map((item) => ({
        id: item.user._id,
        name: item.user.username,
        role: item.user.role,
        permissions: item.permissions.map((p) => ({
          id: p.userPermissionId, 
          name: p.permission_name,
        })),
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching permissions or users:", error);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/permission/export/user/permission', {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'user-permissions.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const uniqueRoles = [...new Set(users.map((u) => u.role))];

  const filteredUsers = users.filter((user) => {
    const matchesPermission = filterPermission
      ? user.permissions.some(p => p.name.includes(filterPermission))
      : true;
    const matchesSearch = searchQuery
      ? user.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesRole = filterRole ? user.role === filterRole : true;
    return matchesPermission && matchesSearch && matchesRole;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    const [resource, action] = perm.permission_name.split(":");
    if (!acc[resource]) acc[resource] = {};
    acc[resource][action] = perm.permission_name;
    return acc;
  }, {});

  const allActions = [
    "read",
    "create",
    "update",
    "delete",
    "admin",
    "manage",
    "reports",
  ];

  const handlePermissionToggle = async (permName, userId, hasPerm) => {
    const requestUser = JSON.parse(localStorage.getItem("amoagc_user") || "{}");
    const requestUserId = requestUser?.id;

    const permObj = allPermissions.find(
      (p) => p.permission_name === permName
    );

    const permid = users
      .find((u) => u.id === userId)
      ?.permissions.find((p) => p.name === permName)?.id;

    setSelectedUser((prev) => {
      if (!prev) return prev;
      const updatedPermissions = hasPerm
        ? prev.permissions.filter((p) => p.name !== permName)
        : [...prev.permissions, { name: permName, id: permid || null }];
      return { ...prev, permissions: updatedPermissions };
    });

    try {
      if (hasPerm) {
        await fetch(`/api/user/permission/revoke/${permid}`, {
          method: 'DELETE',
        });
      } else {
        await fetch("/api/user/permission/grant", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            permissionId: permObj._id,
            requestUserId,
          }),
        });
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? {
                ...u,
                permissions: hasPerm
                  ? u.permissions.filter((p) => p.name !== permName)
                  : [...u.permissions, { name: permName, id: permid || null }],
              }
            : u
        )
      );
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterRole("");
    setFilterPermission("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || filterRole || filterPermission;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Permissions Management
                </h1>
                <p className="text-slate-600 mt-1">
                  Manage user roles and permissions across your system
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
              
              <button
                onClick={exportToExcel}
                disabled={isExporting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isExporting ? "Exporting..." : "Export Excel"}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-slate-800">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Permissions</p>
                <p className="text-2xl font-bold text-slate-800">{allPermissions.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Unique Roles</p>
                <p className="text-2xl font-bold text-slate-800">{uniqueRoles.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    Permissions Count
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-blue-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {user.permissions.length} permissions
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                      >
                        Manage Permissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">
                  {currentPage}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Permissions Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedUser(null)}></div>
              
              <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">
                        Permissions for {selectedUser.name}
                      </h3>
                      <p className="text-slate-600">Role: {selectedUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-300 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                      <tr>
                        <th className="p-4 text-left font-semibold text-slate-700 border-r border-slate-300">
                          Resource
                        </th>
                        {allActions.map((action) => (
                          <th
                            key={action}
                            className="p-4 text-center font-semibold text-slate-700 border-r border-slate-300 capitalize min-w-[100px]"
                          >
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedPermissions).map(([resource, actions], index) => (
                        <tr 
                          key={resource} 
                          className={`hover:bg-slate-50 transition-colors duration-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                          }`}
                        >
                          <td className="p-4 font-medium text-slate-800 capitalize border-r border-slate-300">
                            {resource}
                          </td>
                          {allActions.map((action) => {
                            const permName = actions[action];
                            const hasPerm = permName && selectedUser.permissions.some(p => p.name === permName);

                            return (
                              <td
                                key={action}
                                className="p-4 text-center border-r border-slate-300"
                              >
                                {permName ? (
                                  <label className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={hasPerm}
                                      onChange={() =>
                                        handlePermissionToggle(
                                          permName,
                                          selectedUser.id,
                                          hasPerm
                                        )
                                      }
                                      className="sr-only"
                                    />
                                    <div className="relative">
                                      {hasPerm ? (
                                        <CheckCircle className="w-6 h-6 text-green-500 hover:text-green-600 transition-colors duration-200" />
                                      ) : (
                                        <XCircle className="w-6 h-6 text-slate-300 hover:text-slate-400 transition-colors duration-200" />
                                      )}
                                    </div>
                                  </label>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-6 py-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}