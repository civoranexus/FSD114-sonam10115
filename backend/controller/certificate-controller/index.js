// controllers/certificateController.js
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import generateCertificate from "../utils/generateCertificate.js";

export const generateCertificateAPI = async (req, res) => {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment.isCompleted)
        return res.status(400).json({ message: "Course not completed" });

    const user = await User.findById(enrollment.userId);
    const course = await Course.findById(enrollment.courseId);

    const filePath = generateCertificate(user.name, course.title);
    enrollment.certificateUrl = filePath;
    await enrollment.save();

    res.json({ certificateUrl: filePath });
};
