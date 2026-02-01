import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { Trash2, Edit, Search } from "lucide-react";
import { fetchAllUsers, deleteUser } from "../../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await fetchAllUsers(1, 50);
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.message);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Add New User
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none border-l pl-4"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.userName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.userEmail}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "teacher"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "teacher" ? "Instructor" : "Student"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
