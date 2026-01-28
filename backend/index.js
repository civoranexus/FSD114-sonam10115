const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db.js');
dotenv.config();
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
const PORT = 8000;

// Import & mount route modules (CommonJS routers)
const authRoutes = require('./routes/auth-routes/index.js');
const instructorCourseRoutes = require('./routes/instructor-routes/course-route.js');
const instructorMediaRoutes = require('./routes/instructor-routes/media-route.js');
const studentCourseRoutes = require('./routes/student-routes/course-routes.js');
const studentProgressRoutes = require('./routes/student-routes/course-progress-routes.js');
const studentOrderRoutes = require('./routes/student-routes/order-routes.js');
const studentCoursesRoutes = require('./routes/student-routes/student-courses-routes.js');
const chatRoutes = require('./routes/chat-Routes/chatRoutes.js');

app.use('/chat', chatRoutes);

app.use('/', authRoutes);
app.use('/auth', authRoutes);
app.use('/api', authRoutes);

app.use('/instructor', instructorCourseRoutes);
app.use('/media', instructorMediaRoutes);

app.use('/student', studentCourseRoutes);
app.use('/student', studentProgressRoutes);
app.use('/student', studentOrderRoutes);
app.use('/student', studentCoursesRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
}); 