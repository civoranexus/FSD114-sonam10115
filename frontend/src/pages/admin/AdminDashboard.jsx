import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { Users, BookOpen, ShoppingCart, TrendingUp } from "lucide-react";
import { fetchDashboardStats } from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await fetchDashboardStats();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
      <div className={`${color} p-3 rounded-lg`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              color="bg-blue-500"
            />
            <StatCard
              icon={BookOpen}
              label="Total Courses"
              value={stats.totalCourses}
              color="bg-green-500"
            />
            <StatCard
              icon={ShoppingCart}
              label="Total Orders"
              value={stats.totalOrders}
              color="bg-yellow-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Revenue"
              value={`$${stats.totalRevenue}`}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              Add New Course
            </button>
            <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
              View Users
            </button>
            <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition">
              View Orders
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="text-gray-600 text-center py-8">
            No recent activity to display.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
