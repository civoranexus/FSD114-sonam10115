// controllers/courseController.js
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const completeLesson = async (req, res) => {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);
    const course = await Course.findById(enrollment.courseId);

    enrollment.completedLessons += 1;

    if (enrollment.completedLessons === course.totalLessons) {
        enrollment.isCompleted = true;
    }

    await enrollment.save();
    res.json(enrollment);
};
