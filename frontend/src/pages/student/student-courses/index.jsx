import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch, Award } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CertificateModal from "@/components/certificate-modal";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const [certificateModal, setCertificateModal] = useState({
    isOpen: false,
    courseId: null,
    courseName: null,
  });

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
    console.log(response);
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  const openCertificateModal = (courseId, courseName) => {
    setCertificateModal({
      isOpen: true,
      courseId,
      courseName,
    });
  };

  const closeCertificateModal = () => {
    setCertificateModal({
      isOpen: false,
      courseId: null,
      courseName: null,
    });
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Continue learning or download your certificates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1 text-gray-800 line-clamp-2">
                  {course?.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {course?.instructorName}
                </p>
                <div className="text-xs text-gray-500">
                  <p>
                    📅{" "}
                    {new Date(course?.dateOfPurchase).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-4 flex flex-col gap-2">
                <Button
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Continue Course
                </Button>

                <Button
                  onClick={() =>
                    openCertificateModal(course?.courseId, course?.title)
                  }
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Get Certificate
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <Award size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                No Courses Yet
              </h2>
              <p className="text-gray-600 mb-4">
                Start your learning journey by exploring our courses!
              </p>
              <Button onClick={() => navigate("/student/courses")}>
                Browse Courses
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        courseId={certificateModal.courseId}
        courseName={certificateModal.courseName}
        studentName={auth?.user?.userName || "Student"}
        isOpen={certificateModal.isOpen}
        onClose={closeCertificateModal}
      />
    </div>
  );
}

export default StudentCoursesPage;
