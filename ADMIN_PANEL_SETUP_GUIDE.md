# Admin Panel Setup & Usage Guide

## Quick Start

### 1. Backend Setup

The admin routes are already configured and integrated in the backend. No additional setup is needed.

**File Structure:**

```
backend/
├── middleware/
│   ├── auth-middleware.js (existing)
│   └── admin-middleware.js (NEW - verifies admin role)
├── controller/
│   └── admin-controller/
│       └── index.js (existing - contains all admin logic)
├── routes/
│   └── admin-routes/
│       └── index.js (updated - now includes admin middleware)
└── index.js (already includes admin routes)
```

### 2. Frontend Setup

All frontend components are ready to use. The routes are configured in App.jsx.

**File Structure:**

```
frontend/
├── src/
│   ├── components/
│   │   └── admin-view/
│   │       └── layout.jsx (NEW - admin sidebar layout)
│   ├── pages/
│   │   └── admin/
│   │       ├── AdminDashboard.jsx (NEW)
│   │       ├── AdminUsers.jsx (NEW)
│   │       ├── AdminCourses.jsx (NEW)
│   │       ├── AdminOrders.jsx (NEW)
│   │       └── AdminAnalytics.jsx (NEW)
│   ├── services/
│   │   └── adminService.js (NEW - admin API calls)
│   └── App.jsx (updated - new admin routes)
```

## Accessing the Admin Panel

### Prerequisites

1. User must have admin role in database
2. User must be authenticated with valid JWT token

### Steps

1. Login with an admin account
2. Navigate to `http://localhost:5173/admin`
3. You should see the admin dashboard

### Setting Admin Role (Database)

To make a user an admin, update their role in the User collection:

```javascript
// In MongoDB
db.users.updateOne({ _id: ObjectId("userId") }, { $set: { role: "admin" } });
```

## API Endpoints

### All endpoints require:

- Valid JWT token in Authorization header or cookies
- User must have admin role

### Base URL

```
http://localhost:8000/admin
```

### Available Endpoints

#### Dashboard

```
GET /admin/dashboard/stats
Response: { success, data: { totalUsers, totalCourses, totalOrders, totalRevenue } }
```

#### Users

```
GET /admin/users?page=1&limit=10
GET /admin/users/:userId
DELETE /admin/users/:userId
PUT /admin/users/:userId/role
  Body: { role: "student" | "instructor" | "admin" }
```

#### Courses

```
GET /admin/courses?page=1&limit=10
GET /admin/courses/:courseId
DELETE /admin/courses/:courseId
```

#### Orders

```
GET /admin/orders?page=1&limit=10
```

#### Analytics

```
GET /admin/analytics
Response: { success, data: { revenueByMonth, topCourses, userGrowthByMonth } }
```

## Frontend Components

### AdminLayout

Main layout component with sidebar navigation.

```jsx
import AdminLayout from "./components/admin-view/layout";

function YourComponent() {
  return (
    <AdminLayout>
      <div>Your content here</div>
    </AdminLayout>
  );
}
```

### Admin Service

Use admin service for API calls.

```jsx
import {
  fetchDashboardStats,
  fetchAllUsers,
  deleteUser,
  fetchAllCourses,
  deleteCourse,
  fetchAllOrders,
  fetchAnalytics,
} from "./services/adminService";

// Example usage
const stats = await fetchDashboardStats();
const users = await fetchAllUsers(1, 10);
await deleteUser(userId);
```

## Environment Configuration

No new environment variables required. Ensure existing ones are set:

- `REACT_APP_API_URL` or use the configured axios instance
- `JWT_SECRET` (backend)

## Common Issues & Solutions

### Issue: Admin pages show 403 Forbidden

**Solution:**

- Verify user has admin role in database
- Check JWT token is valid
- Clear browser cache and re-login

### Issue: Dashboard doesn't load statistics

**Solution:**

- Check backend is running on port 8000
- Verify database connection
- Check browser console for errors

### Issue: Tables show "No data"

**Solution:**

- Verify data exists in database
- Check pagination parameters
- Check API response in Network tab

### Issue: Images/Icons not loading

**Solution:**

- Verify lucide-react is installed: `npm install lucide-react`
- Check Tailwind CSS is properly configured

## Testing the Admin Panel

### Test Checklist

1. **Authentication**
   - [ ] Non-authenticated user redirected to login
   - [ ] Non-admin user cannot access `/admin`
   - [ ] Admin user can access `/admin`

2. **Dashboard**
   - [ ] Stats load correctly
   - [ ] Numbers are accurate
   - [ ] Quick action buttons visible

3. **Users Management**
   - [ ] User list loads
   - [ ] Search filter works
   - [ ] Can delete user
   - [ ] Delete confirmation appears
   - [ ] User count updates after delete

4. **Courses Management**
   - [ ] Course list loads
   - [ ] Search filter works
   - [ ] Can delete course
   - [ ] Course prices display correctly

5. **Orders Management**
   - [ ] Order list loads
   - [ ] Customer info displays
   - [ ] Status color-coding works
   - [ ] Search functionality works

6. **Analytics**
   - [ ] Charts load correctly
   - [ ] Data visualizations work
   - [ ] Progress bars display properly

7. **Navigation**
   - [ ] Sidebar links work
   - [ ] Active route highlighting works
   - [ ] Sidebar collapse/expand works
   - [ ] All pages responsive on mobile

8. **Error Handling**
   - [ ] Error messages display for failed requests
   - [ ] Loading states show correctly
   - [ ] No console errors

## Extending the Admin Panel

### Add a New Admin Feature

1. **Create Backend**
   - Add function to `/backend/controller/admin-controller/index.js`
   - Add route to `/backend/routes/admin-routes/index.js`

2. **Create Frontend**
   - Create new page component in `/frontend/src/pages/admin/`
   - Create service function in `/frontend/src/services/adminService.js`
   - Add route in `/frontend/src/App.jsx`
   - Add navigation link in admin layout

3. **Example: Add Reports Feature**

Backend (controller):

```javascript
exports.getReports = async (req, res) => {
  try {
    // Logic here
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

Backend (routes):

```javascript
router.get("/reports", getReports);
```

Frontend (service):

```javascript
export const fetchReports = async () => {
  const response = await axiosInstance.get("/admin/reports");
  return response.data;
};
```

Frontend (component):

```javascript
import AdminLayout from "../../components/admin-view/layout";
import { fetchReports } from "../../services/adminService";

function AdminReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      const result = await fetchReports();
      if (result.success) setReports(result.data);
    };
    loadReports();
  }, []);

  return <AdminLayout>{/* Your UI here */}</AdminLayout>;
}

export default AdminReports;
```

Frontend (routes in App.jsx):

```javascript
<Route path="/admin/reports" element={<AdminReports />} />
```

## Performance Optimization Tips

1. **Pagination**: Always use pagination for large datasets
2. **Caching**: Implement React Query or SWR for API caching
3. **Debouncing**: Add debounce to search inputs
4. **Lazy Loading**: Use React.lazy() for admin pages
5. **Code Splitting**: Each admin page can be a separate chunk

## Security Considerations

1. **Role-Based Access**: Only admins can access `/admin` routes
2. **Token Validation**: All requests validated server-side
3. **CORS**: Backend configured with specific origin
4. **Input Validation**: Sanitize all user inputs
5. **Rate Limiting**: Consider adding rate limiting to admin routes

## Support & Debugging

### Enable Debug Logging

Backend:

```javascript
// In controller functions
console.log("Admin action:", { action, userId, timestamp: new Date() });
```

Frontend:

```javascript
// In service functions
console.log("Admin API call:", { endpoint, params });
```

### Check Logs

Backend:

```bash
npm start  # Shows all console logs
```

Frontend:

```bash
npm run dev  # Shows all console logs
```

## Troubleshooting Commands

```bash
# Check if backend is running
curl http://localhost:8000/admin/dashboard/stats

# Check if frontend routes exist
# Visit http://localhost:5173/admin in browser

# Check database connection
# In MongoDB: db.users.countDocuments()

# Clear cache
# Ctrl+Shift+Del (Chrome) or Cmd+Shift+Del (Mac)
```

## Next Steps

1. Test all functionality thoroughly
2. Add data validation on frontend
3. Implement pagination UI
4. Add filters for tables
5. Create admin user guide
6. Set up backup procedures
7. Monitor admin actions
8. Plan additional features

---

For issues or questions, check the browser console and backend logs for detailed error messages.
