import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { Search, Eye } from "lucide-react";
import { fetchAllOrders } from "../../services/adminService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await fetchAllOrders(1, 50);
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>

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
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none border-l pl-4"
            />
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order._id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.userName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.courseTitle || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${order.coursePricing}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.paymentStatus || "pending",
                        )}`}
                      >
                        {order.paymentStatus || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye size={18} />
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

export default AdminOrders;
