import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { TrendingUp, Users, BookOpen, ShoppingCart } from "lucide-react";
import { fetchAnalytics } from "../../services/adminService";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    monthlyRevenue: [],
    topCourses: [],
    userGrowth: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const result = await fetchAnalytics();
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const StatItem = ({ icon: Icon, label, value, trend }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className="text-green-600 text-sm mt-2">
              ↑ {trend}% from last month
            </p>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading analytics...</div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatItem
                icon={TrendingUp}
                label="Monthly Revenue"
                value="$18,000"
                trend={20}
              />
              <StatItem icon={Users} label="New Users" value="200" trend={15} />
              <StatItem
                icon={BookOpen}
                label="Active Courses"
                value="24"
                trend={8}
              />
              <StatItem
                icon={ShoppingCart}
                label="Monthly Orders"
                value="45"
                trend={12}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4">Monthly Revenue</h2>
                <div className="space-y-4">
                  {analytics.monthlyRevenue.slice(0, 5).map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {item._id?.year}-
                          {item._id?.month?.toString().padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium">
                          ${item.revenue}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(item.revenue / 50000) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Courses */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-4">Top Courses</h2>
                <div className="space-y-4">
                  {analytics.topCourses.slice(0, 5).map((course, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {course.course?.[0]?.title || "Course"}
                        </span>
                        <span className="text-sm font-medium">
                          {course.enrollments}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(course.enrollments / 150) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Growth */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">User Growth</h2>
              <div className="space-y-4">
                {analytics.userGrowthByMonth?.slice(0, 5).map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {item._id?.year}-
                        {item._id?.month?.toString().padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium">
                        {item.newUsers}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(item.newUsers / 100) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAnalytics;
