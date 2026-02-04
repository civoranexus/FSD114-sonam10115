# Copilot Instructions - CivoraX LMS Platform

**Project**: Full-stack LMS (Learning Management System) for the CivoraX Internship Program  
**Stack**: Node.js/Express (Backend) + React/Vite (Frontend) + MongoDB  
**Duration**: 5-week internship program (Jan 5 - Feb 8, 2026)

---

## Architecture Overview

### Backend Structure (`/backend`)

- **Entry**: `index.js` - Express server with route mounting on port 8000
- **Pattern**: CommonJS (`require/module.exports`) - do NOT use ES6 imports
- **Database**: MongoDB via Mongoose ORM
- **Authentication**: JWT tokens (Bearer + cookies), stored in `Authorization` header or cookies
- **Key Middleware**: `auth-middleware.js` (JWT verification + lastActive update)

### Frontend Structure (`/frontend`)

- **Build**: Vite + React 18
- **Module System**: ES6 (`import/export`) - NOT CommonJS
- **Components**: Modular React components in `/src/components` and `/src/pages`
- **State Management**: Context API + local state via `useState`
- **UI Framework**: Radix UI components + Tailwind CSS

### Route Organization

Routes are modular by resource (auth, instructor, student, admin, quiz, chat, etc.):

```
/auth        → Authentication (login, register)
/instructor  → Course management for instructors
/student     → Student course access, progress, orders
/quiz        → Quiz questions and attempts
/chat        → AI chat integration
/certificate → Certificate generation
/admin       → Admin dashboard
```

---

## Critical Configuration

### Environment Variables (Backend `.env`)

```
PORT=8000
MONGODB_URI=<connection_string>
JWT_SECRET=<secret_key>
OPENAI_API_KEY=sk-... (length: 164 chars)
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
PAYPAL_CLIENT_ID=<id>
PAYPAL_CLIENT_SECRET=<secret>
```

### CORS Setup

Backend allows requests from `http://localhost:5173` (Vite dev server) with credentials.

---

## Key Patterns & Conventions

### 1. **Module Exports (Backend - CommonJS)**

```javascript
// ✅ CORRECT: Route files must export routers
const router = express.Router();
router.get("/", controllerFunction);
module.exports = router;

// ✅ Models follow schema-export pattern
const UserSchema = new mongoose.Schema({
  /* fields */
});
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
```

### 2. **Authentication Flow**

- JWT token in `Authorization: Bearer <token>` OR `req.cookies.accessToken`
- `auth-middleware.js` validates token and attaches `req.user` (payload)
- IMPORTANT: Verify token extraction handles both Bearer and cookie formats

### 3. **Controller Pattern**

Controllers live in `controller/*/index.js` or role-specific subfolders (admin-controller, auth-controller, etc.):

```javascript
// Example: Extract controller logic, avoid inline business logic in routes
const handleCourseCreation = async (req, res) => {
  try {
    // Logic here
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
```

### 4. **Response Format**

Standard API responses include `success` boolean + data/message:

```javascript
{ success: true, data: {...} }
{ success: false, message: "Error details" }
```

### 5. **File Upload Flow**

- Images/media: Multer middleware → Cloudinary helper (`helpers/cloudinary.js`)
- Certificates: PDFKit (`utils/generateCertificate.js`)
- Static files served from `/certificates` directory

### 6. **React Component Structure**

```javascript
// Pages in src/pages, components in src/components
import { useState, useEffect } from 'react';
import axios from 'axios'; // axios for API calls

export default function MyPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch on mount
  }, []);

  return (/* JSX */);
}
```

---

## Common Commands

### Backend

```bash
cd backend
npm install                # Install dependencies
npm run dev              # Start with nodemon (auto-reload)
node utils/test-ai.js    # Test OpenAI integration
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # Start Vite dev server (port 5173)
npm run build            # Production build
```

### Database

Ensure MongoDB is running. Connection via `utils/db.js` on application start.

---

## Integration Points & Data Flows

### User Journey (Student)

1. **Auth**: Register/Login → JWT token → stored in cookies
2. **Browse**: Fetch courses via `/student/courses`
3. **Enroll**: Create StudentCourse entry → PayPal payment
4. **Learn**: Access course content → track progress via CourseProgress model
5. **Quiz**: Take quiz → store Quiz attempt → calculate score
6. **Certificate**: Generate on course completion via PDFKit

### AI Chat Feature

- Service: `service/aiService.js`
- Config: `config/openai.js`
- Error: 429 means API quota exceeded - check OpenAI billing/credits
- Endpoint: `/chat` routes via `routes/chat-Routes/index.js`

### Course Upload (Instructor)

- Media upload → Multer → Cloudinary
- Metadata stored in Course model
- Media routes: `/media` (separate from course routes for better separation)

---

## Common Pitfalls & Fixes

| Issue                                            | Root Cause                                   | Fix                                                                        |
| ------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------- |
| `TypeError: argument handler must be a function` | Route file missing `module.exports`          | Ensure `module.exports = router;` at end of route files                    |
| `ReferenceError: require is not defined`         | File treated as ES module but using CommonJS | Check file extension (.mjs) or remove `"type": "module"` from package.json |
| `429 Insufficient Quota` (OpenAI)                | API credits depleted                         | Check OpenAI dashboard, add payment method, regenerate key                 |
| CORS errors                                      | Frontend URL not in corsOptions              | Update `corsOptions.origin` to match dev/prod frontend URL                 |
| Token not found                                  | Missing Bearer token or cookie               | Verify `Authorization` header format or `accessToken` cookie set           |

---

## File References for Patterns

- **Auth flow**: [auth-middleware.js](../../backend/middleware/auth-middleware.js), [auth-routes/index.js](../../backend/routes/auth-routes/)
- **Model schema**: [User.js](../../backend/models/User.js), [Course.js](../../backend/models/Course.js)
- **File upload**: [helpers/cloudinary.js](../../backend/helpers/cloudinary.js), [multer middleware](../../backend/middleware/)
- **React UI**: [QuizPage component](../../frontend/src/pages/) (example with animations)
- **Environment setup**: [backend/package.json](../../backend/package.json) & [frontend/package.json](../../frontend/package.json)

---

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev` (port 8000)
2. **Start Frontend**: `cd frontend && npm run dev` (port 5173)
3. **Test API**: Use Postman/Thunder Client with Bearer token
4. **Check Logs**: Backend logs in terminal; Frontend in browser console
5. **Hot Reload**: Both use auto-reload (nodemon + Vite)

---

**Last Updated**: February 4, 2026  
**AI Agent Goal**: Understand this LMS architecture, respect CommonJS/ES6 module boundaries, and leverage existing controllers, models, and middleware patterns.
