import axiosInstance from "@/api/axiosInstance";
import { useSocketStore } from "./socketStore";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";



export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", formData);

  useSocketStore.setState({ authUser: data });

  handleSocketConnection(data);

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  useSocketStore.setState({ authUser: data });

  handleSocketConnection(data);

  toast.success("Logged in successfully");
  return data;
}

export async function checkAuthService() {
  try {
    const { data } = await axiosInstance.get("/auth/check-auth");

    useSocketStore.setState({ authUser: data });

    handleSocketConnection(data);

    return data;
  } catch (error) {
    handleSocketConnection(null);
    return null;
  }
}

export async function logoutService() {
  try {
    await axiosInstance.post("/auth/logout");

    useSocketStore.setState({ authUser: null });

    handleSocketConnection(null);

    toast.success("Logged out successfully");
  } catch (error) {
    toast.error("Logout failed");
  }
}

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/get?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

// ==================== ADMIN SERVICES ====================

export async function getAdminDashboardStats() {
  const { data } = await axiosInstance.get(`/admin/dashboard/stats`);
  return data;
}

export async function getAdminUsers(page = 1, limit = 10, role = "") {
  const { data } = await axiosInstance.get(
    `/admin/users?page=${page}&limit=${limit}&role=${role}`
  );
  return data;
}

export async function getAdminUserById(userId) {
  const { data } = await axiosInstance.get(`/admin/users/${userId}`);
  return data;
}

export async function deleteAdminUser(userId) {
  const { data } = await axiosInstance.delete(`/admin/users/${userId}`);
  return data;
}

export async function updateAdminUserRole(userId, role) {
  const { data } = await axiosInstance.put(`/admin/users/${userId}/role`, {
    role,
  });
  return data;
}

export async function getAdminCourses(page = 1, limit = 10) {
  const { data } = await axiosInstance.get(
    `/admin/courses?page=${page}&limit=${limit}`
  );
  return data;
}

export async function getAdminCourseById(courseId) {
  const { data } = await axiosInstance.get(`/admin/courses/${courseId}`);
  return data;
}

export async function deleteAdminCourse(courseId) {
  const { data } = await axiosInstance.delete(`/admin/courses/${courseId}`);
  return data;
}

export async function getAdminOrders(page = 1, limit = 10) {
  const { data } = await axiosInstance.get(
    `/admin/orders?page=${page}&limit=${limit}`
  );
  return data;
}

export async function getAdminAnalytics() {
  const { data } = await axiosInstance.get(`/admin/analytics`);
  return data;
}

//certificate services
export async function generateCertificateService(courseId) {
  const { data } = await axiosInstance.post(`/certificate/generate/${courseId}`);
  return data;
}

export async function downloadCertificateService(filename) {
  const response = await axiosInstance.get(`/certificate/download/${filename}`, {
    responseType: "blob",
  });
  return response.data;
}


function handleSocketConnection(authUser) {
  const { socket } = useSocketStore.getState();

  // Logout / Unauthorized
  if (!authUser) {
    if (socket?.connected) {
      socket.disconnect();
    }

    useSocketStore.setState({
      socket: null,
      onlineUsers: [],
    });

    return;
  }

  //  Already connected
  if (socket?.connected) return;

  //  Fresh connection
  const socketClient = io(BASE_URL, {
    withCredentials: true,
    autoConnect: false,
  });

  socketClient.connect();

  socketClient.on("getOnlineUsers", (users) => {
    useSocketStore.setState({ onlineUsers: users });
  });

  useSocketStore.setState({ socket: socketClient });
}