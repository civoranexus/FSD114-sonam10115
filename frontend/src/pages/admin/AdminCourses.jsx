// ...existing code...
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin-view/layout";
import { Trash2, Edit, Search, Plus } from "lucide-react";
import { fetchAllCourses, deleteCourse } from "../../services/adminService";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const result = await fetchAllCourses(1, 50);
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course._id !== id));
      } catch (error) {
        console.error("Error deleting course:", error);
        setError(error.message);
      }
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6 bg-[#F4F7FA] p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#142C52]">
            Courses Management
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#16808D] text-white px-4 py-2 rounded-lg hover:bg-[#142C52] transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Course
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            Error: {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 border border-[#E0E7F1]">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-[#142C52]/60" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none border-l pl-4 text-[#142C52]"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[#142C52]">
            Loading courses...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#E0E7F1]">
            <table className="w-full min-w-full">
              <thead className="bg-[#F4F7FA] border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#142C52]">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#142C52]">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#142C52]">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#142C52]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-[#142C52]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-[#F4F7FA]">
                    <td className="px-6 py-4 text-sm font-medium text-[#142C52]">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#142C52]/70">
                      {course.instructorID?.userName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#142C52]">
                      ${course.pricing}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#1B9AAA]/20 text-[#142C52]">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button className="text-[#142C52] hover:text-[#16808D]">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
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

export default AdminCourses;
// ...existing code...
