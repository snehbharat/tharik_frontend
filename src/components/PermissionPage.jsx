import React, { useState } from "react";
import { Download } from "lucide-react";

export default function PermissionsPage( {isArabic} ) {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", permissions: { admin: true, read: true, create: false, update: true, delete: false } },
    { id: 2, name: "Bob", permissions: { admin: false, read: true, create: true, update: false, delete: false } },
    { id: 3, name: "Charlie", permissions: { admin: false, read: false, create: false, update: false, delete: true } },
    { id: 4, name: "David", permissions: { admin: true, read: true, create: true, update: true, delete: true } },
    { id: 5, name: "Eve", permissions: { admin: false, read: true, create: false, update: true, delete: false } },
    { id: 6, name: "Frank", permissions: { admin: false, read: false, create: true, update: false, delete: true } },
    { id: 7, name: "Grace", permissions: { admin: false, read: true, create: false, update: false, delete: false } },
    { id: 8, name: "Hank", permissions: { admin: true, read: true, create: true, update: true, delete: false } },
    { id: 9, name: "Ivy", permissions: { admin: false, read: true, create: true, update: true, delete: false } },
    { id: 10, name: "Jack", permissions: { admin: false, read: false, create: false, update: false, delete: false } },
    { id: 11, name: "Kim", permissions: { admin: true, read: true, create: false, update: true, delete: true } },
    { id: 12, name: "Leo", permissions: { admin: false, read: true, create: true, update: false, delete: false } },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterPermission, setFilterPermission] = useState("");
  const usersPerPage = 10;

  // Filtered users
  const filteredUsers = filterPermission
    ? users.filter((user) => user.permissions[filterPermission])
    : users;

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="p-4">
      <div className=" flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-7">
        Permissions Management
      </h1>
      <button
        onClick={() => console.log("Exporting data...")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Download className="w-4 h-4" />
        Export Data
      </button></div>

      {/* Filter */}
      <div className="mb-4 flex gap-2 items-center">
        <label className="font-medium text-green-700">Filter by:</label>
        <select
          value={filterPermission}
          onChange={(e) => {
            setFilterPermission(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-green-400 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Users</option>
          <option value="admin">Admin</option>
          <option value="read">Read</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-green-300">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-green-200 text-green-900">
              <th className="w-1/2 border border-green-300 p-3 text-left font-semibold">
                Name
              </th>
              <th className="w-1/2 border border-green-300 p-3 text-center font-semibold">
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
                <td className="border border-green-300 p-3">{user.name}</td>
                <td className="border border-green-300 p-3 text-center">
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


      {/* Pagination Controls */}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 border-2 border-green-500">
            <h2 className="text-lg font-bold mb-4 text-green-700">
              Permissions for {selectedUser.name}
            </h2>
            <div className="space-y-2">
              {Object.entries(selectedUser.permissions).map(([perm, value]) => (
                <div key={perm} className="flex items-center justify-between">
                  <span className="capitalize">{perm}</span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        permissions: {
                          ...prev.permissions,
                          [perm]: !prev.permissions[perm],
                        },
                      }))
                    }
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-3 py-1 bg-green-300 hover:bg-green-400 text-white rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === selectedUser.id ? selectedUser : u
                    )
                  );
                  setSelectedUser(null);
                }}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
