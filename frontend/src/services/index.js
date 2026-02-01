import axiosInstance from "@/api/axiosInstance";

export async function sendMessageApi(data) {
  const response = await axiosInstance.post("/chat/send", data);
  return response.data;
}

export async function fetchMessagesApi(courseId, userId) {
  const { data } = await axiosInstance.get(`/chat/${courseId}/${userId}`);
  return data;
}

export async function fetchInstructorConversationsService() {
  const { data } = await axiosInstance.get(`/chat/instructor/conversations`);
  return data;
}

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

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
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
