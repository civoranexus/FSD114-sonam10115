import React from "react";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

export default AdminLayout;
