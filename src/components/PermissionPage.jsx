import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import axios from "axios";

export default function PermissionsPage({ isArabic }) {
  const [allPermissions, setAllPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterPermission, setFilterPermission] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const usersPerPage = 10;

  const fetchPermissions = async () => {
    try {
      const permsResponse = await axios.get("/api/permission/all");
      const perms = Array.isArray(permsResponse.data.data)
        ? permsResponse.data.data
        : [];
      setAllPermissions(perms);

      const userResponse = await axios.get(
        "/api/user/permission/getUserWithPermission"
      );
      const apiData = userResponse.data.data || [];
      console.log("API Data:", apiData);

      const formattedUsers = apiData.map((item) => ({
        id: item.user._id,
        name: item.user.username,
        role: item.user.role,
        permissions: item.permissions.map((p) => ({
          id: p.userPermissionId, 
          name: p.permission_name,
        })),
      }));
      console.log("Formatted Users:", formattedUsers);

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching permissions or users:", error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const uniqueRoles = [...new Set(users.map((u) => u.role))];

  const filteredUsers = users.filter((user) => {
    const matchesPermission = filterPermission
      ? user.permissions.includes(filterPermission)
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
  const requestUser = JSON.parse(localStorage.getItem("amoagc_user"));
  const requestUserId = requestUser?.id;

  const permObj = allPermissions.find(
    (p) => p.permission_name === permName
  );

  const permid = users
    .find((u) => u.id === userId)
    ?.permissions.find((p) => p.name === permName)?.id;

  // ✅ Update selectedUser in real time
  setSelectedUser((prev) => {
    if (!prev) return prev;
    const updatedPermissions = hasPerm
      ? prev.permissions.filter((p) => p.name !== permName)
      : [...prev.permissions, { name: permName, id: permid || null }];
    return { ...prev, permissions: updatedPermissions };
  });

  try {
    if (hasPerm) {
      await axios.delete(`/api/user/permission/revoke/${permid}`);
    } else {
      await axios.post("/api/user/permission/grant", {
        userId,
        permissionId: permObj._id,
        requestUserId,
      });
    }

    // ✅ Also update users array so table stays in sync
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


  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-7">
          Permissions Management
        </h1>
        <button
          onClick={() => console.log("Exporting data...")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-3 items-center flex-wrap">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded p-2"
        />

        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-blue-400 rounded p-2"
        >
          <option value="">All Roles</option>
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-neutral-300">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-neutral-200 text-neutral-900">
              <th className="w-1/3 border border-neutral-300 p-3 text-left font-semibold">
                UserName
              </th>
              <th className="w-1/3 border border-neutral-300 p-3 text-left font-semibold">
                Role
              </th>
              <th className="w-1/3 border border-neutral-300 p-3 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-green-50 transition-colors duration-200"
              >
                <td className="border border-neutral-300 p-3">{user.name}</td>
                <td className="border border-neutral-300 p-3">{user.role}</td>
                <td className="border border-neutral-300 p-3 text-center">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition duration-200"
                  >
                    Show Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-green-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Permissions Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl border-2 border-neutral-500 overflow-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4 text-green-700">
              Permissions for {selectedUser.name}
            </h2>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300 text-left">
                    Resource
                  </th>
                  {allActions.map((action) => (
                    <th
                      key={action}
                      className="p-2 border border-gray-300 capitalize"
                    >
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedPermissions).map(
                  ([resource, actions]) => (
                    <tr key={resource} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300 font-medium capitalize">
                        {resource}
                      </td>
                      {allActions.map((action) => {
                        const permName = actions[action];
                        const hasPerm = permName && selectedUser.permissions.some(p => p.name === permName);

                        return (
                          <td
                            key={action}
                            className="p-2 border border-gray-300 text-center"
                          >
                            {permName ? (
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
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-3 py-1 bg-green-300 hover:bg-green-400 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
