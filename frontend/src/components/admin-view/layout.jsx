import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ShoppingCart,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Courses", path: "/admin/courses", icon: BookOpen },
    { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className={isSidebarOpen ? "block" : "hidden"}>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-gray-800 p-2 rounded"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 mx-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
