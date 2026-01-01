# QR-Based Attendance System

A modern, secure web application for managing student attendance using dynamic QR codes. Built with React (frontend) and Node.js/Express (backend), featuring real-time attendance tracking, automatic student enrollment, and rotating QR codes for enhanced security.

---

## 🎯 Overview

This system allows lecturers to create courses, generate time-limited attendance sessions with QR codes, and track student attendance in real-time. Students scan QR codes to mark their attendance, with automatic course enrollment on first scan. The system includes security features like rotating QR codes (every 5 seconds) to prevent fraud through screenshot sharing.

---

## ✨ Key Features

### For Lecturers
- **Course Management**: Create, edit, and manage courses
- **Session Management**: Create timed attendance sessions (default 10 minutes)
- **Dynamic QR Codes**: Auto-rotating QR codes every 5 seconds for security
- **Real-time Tracking**: Monitor attendance as students check in
- **Manual Request Review**: Approve/reject manual attendance requests
- **Attendance Reports**: Generate detailed reports with statistics
- **Auto-enrollment**: Students automatically enrolled on first attendance

### For Students
- **QR Code Scanning**: Quick attendance marking via QR code
- **Manual Requests**: Submit attendance requests if unable to scan
- **Student Portal**: View personal attendance records
- **Instant Feedback**: Immediate confirmation of attendance submission

### Security Features
- **Rotating QR Codes**: Changes every 5 seconds to prevent sharing
- **Token Validation**: Time-based cryptographic tokens (HMAC-SHA256)
- **IP-based Fraud Prevention**: Blocks multiple submissions from same device
- **Session Expiration**: Automatic session timeout after duration
- **Physical Presence Required**: Expired tokens prevent remote attendance

### Progressive Web App (PWA)
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Access cached pages without internet
- **Native App Experience**: Standalone mode with custom theme
- **Optimized Performance**: Service worker caching for fast loading

---

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **QRCode.react** - QR code generation
- **PWA** - Service worker & manifest for installability

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **crypto** - Token generation

---

## 📁 Project Structure

```
QR-Based Attendance System/
├── Client/                          # Frontend application
│   ├── public/
│   │   ├── manifest.json           # PWA manifest
│   │   ├── service-worker.js       # Service worker for offline support
│   │   ├── offline.html            # Offline fallback page
│   │   └── sw-register.js          # Service worker registration
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Main layout with sidebar/navbar
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── Sidebar.jsx         # Side navigation menu
│   │   │   ├── ProtectedRoute.jsx  # Route authentication
│   │   │   └── Loader.jsx          # Loading spinner
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Registration.jsx    # Registration page
│   │   │   ├── AttendanceRecords.jsx    # Dashboard/records
│   │   │   ├── AttendanceReports.jsx    # Reports generation
│   │   │   ├── CoursesManagement.jsx    # Course CRUD
│   │   │   ├── SessionManagement.jsx    # Session management
│   │   │   ├── QRCodeSession.jsx        # QR code display
│   │   │   ├── ManualRequests.jsx       # Request approval
│   │   │   ├── Settings.jsx             # User settings
│   │   │   ├── StudentPortal.jsx        # Student dashboard
│   │   │   └── StudentAttendance.jsx    # Student mark attendance
│   │   ├── services/
│   │   │   ├── api.js              # API configuration
│   │   │   └── apiService.js       # API service functions
│   │   ├── styles/                 # Component-specific CSS files
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # Entry point
│   ├── vite.config.js              # Vite configuration
│   └── package.json                # Frontend dependencies
│
├── Server/                          # Backend application
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── courseController.js     # Course operations
│   │   ├── sessionController.js    # Session & token management
│   │   ├── attendanceController.js # Attendance marking
│   │   ├── manualRequestController.js  # Manual requests
│   │   └── notificationController.js   # Notifications
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Course.js               # Course schema
│   │   ├── Session.js              # Session schema
│   │   ├── Attendance.js           # Attendance schema
│   │   ├── ManualRequest.js        # Manual request schema
│   │   └── Notification.js         # Notification schema
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── courseRoutes.js         # Course endpoints
│   │   ├── sessionRoutes.js        # Session endpoints
│   │   ├── attendanceRoutes.js     # Attendance endpoints
│   │   ├── manualRequestRoutes.js  # Request endpoints
│   │   └── notificationRoutes.js   # Notification endpoints
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   ├── index.js                    # Server entry point
│   └── package.json                # Backend dependencies
│
├── AUTO_ENROLLMENT_UPDATE.md        # Auto-enrollment documentation
├── ROTATING_QR_SECURITY.md          # Security feature documentation
└── README.md                        # This file
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd QR-Based\ Attendance\ System
```

### 2. Backend Setup
```bash
cd Server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/attendance-system
# JWT_SECRET=your-secret-key-here
# CLIENT_URL=http://localhost:5174

# Start server
npm start
```

### 3. Frontend Setup
```bash
cd Client
npm install

# Create .env file (if needed)
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000/api

---

## 📱 Usage Guide

### For Lecturers

#### 1. **Create Account & Login**
- Register at `/register` with email and password
- Login at `/login`

#### 2. **Create Course**
- Navigate to "Courses Management"
- Click "Add New Course"
- Enter course code and name
- Optional: Pre-enroll students (or let auto-enrollment handle it)

#### 3. **Start Attendance Session**
- Go to "Session Management"
- Click "Create New Session"
- Select course, set date/time, duration, and location
- Click "View QR" to display QR code
- QR code rotates every 5 seconds for security
- Session expires after set duration (default 10 minutes)

#### 4. **Monitor Attendance**
- View real-time attendance on session page
- Check "Attendance Records" for detailed stats
- Generate reports from "Attendance Reports" page

#### 5. **Review Manual Requests**
- Go to "Manual Requests"
- Review student requests with reasons
- Approve or reject with optional notes

### For Students

#### 1. **Mark Attendance**
- Scan QR code displayed by lecturer
- Enter matric number on attendance page
- Submit attendance (auto-enrolled if first time)
- Receive confirmation message

#### 2. **Submit Manual Request**
- If unable to scan, go to manual request page
- Select session and enter reason
- Wait for lecturer approval

#### 3. **View Records**
- Access student portal to view attendance history
- Check attendance percentage per course

---

## 🔐 Security Features

### Rotating QR Code System
- **Token Generation**: HMAC-SHA256 based on session ID + time window
- **5-Second Rotation**: New QR code every 5 seconds
- **Grace Period**: Previous token valid for 5 additional seconds
- **Prevents**: Screenshot sharing, group chat forwarding, remote attendance

### Additional Security
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **IP-based Fraud Detection**: Prevents multiple submissions from same device
- **Session Expiration**: Automatic timeout after duration
- **Protected Routes**: Authentication required for sensitive pages

---

## 🎨 Design & UI

### Color Palette
- **Primary Purple**: `#667eea`
- **Secondary Purple**: `#764ba2`
- **Success Green**: `#48bb78`
- **Warning Orange**: `#f6ad55`
- **Danger Red**: `#f56565`
- **Background**: `#f7fafc`

### Features
- **Responsive Design**: Mobile-first approach, works on all devices
- **Gradient UI**: Beautiful purple gradients throughout
- **Icon Integration**: Lucide React icons for visual clarity
- **Card-based Layout**: Modern, clean component design
- **Smooth Animations**: Hover effects and transitions

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses (lecturer's)
- `POST /api/courses` - Create course
- `GET /api/courses/:id` - Get single course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/:id` - Get single session
- `GET /api/sessions/:id/token` - Get rotating token (public)
- `PUT /api/sessions/:id` - Update session
- `PUT /api/sessions/:id/end` - End session
- `DELETE /api/sessions/:id` - Delete session

### Attendance
- `POST /api/attendance/mark` - Mark attendance (requires token)
- `GET /api/attendance/records` - Get attendance records
- `GET /api/attendance/stats/:courseId` - Get course statistics

### Manual Requests
- `GET /api/manual-requests` - Get all requests
- `POST /api/manual-requests` - Create request
- `PUT /api/manual-requests/:id/approve` - Approve request
- `PUT /api/manual-requests/:id/reject` - Reject request

---

## 🌐 Progressive Web App (PWA)

### Features
- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Cached static content available offline
- **Service Worker**: Automatic caching and updates
- **App Icons**: Optimized icons for all device sizes
- **Standalone Mode**: Runs like a native app

### Installation
1. Open app in Chrome/Edge/Safari
2. Click install icon in address bar
3. App installs to device home screen/applications
4. Launch as standalone app

### PWA Checklist
✅ HTTPS enabled (required for production)
✅ Web app manifest configured
✅ Service worker registered
✅ App icons (192x192, 512x512)
✅ Offline fallback page
✅ Responsive design
✅ Theme colors defined

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd Client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
cd Server
# Set environment variables in hosting platform
# Deploy with start command: node index.js
```

### Environment Variables
**Backend (.env):**
```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-strong-secret-key
CLIENT_URL=https://your-frontend-domain.com
```

**Frontend (.env):**
```
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 🧪 Testing

### Test Scenarios

1. **Normal Attendance Flow**
   - Create session → Display QR → Student scans → Attendance marked ✓

2. **Auto-enrollment**
   - New student scans QR → Automatically enrolled in course ✓

3. **Token Security**
   - Screenshot QR code → Wait 15 seconds → Try to use → Rejected ✓

4. **Manual Requests**
   - Student submits request → Lecturer approves → Attendance marked ✓

5. **IP Fraud Prevention**
   - Mark attendance → Try again from same device → Rejected ✓

---

## 📝 Recent Updates

### Auto-Enrollment Feature
- Students automatically enrolled on first attendance
- No need for manual pre-enrollment by lecturers
- Manual enrollment still available as optional feature
- See [AUTO_ENROLLMENT_UPDATE.md](AUTO_ENROLLMENT_UPDATE.md) for details

### Rotating QR Code Security
- QR codes change every 5 seconds
- Time-based cryptographic tokens
- Prevents screenshot/forwarding fraud
- Grace period for smooth scanning
- See [ROTATING_QR_SECURITY.md](ROTATING_QR_SECURITY.md) for details

---

## 🐛 Troubleshooting

### Backend Won't Start
- Check MongoDB connection string
- Verify port 5000 is not in use
- Ensure all environment variables are set

### Frontend Won't Start
- Clear node_modules and reinstall
- Check that backend API URL is correct
- Verify port 5174 is available

### QR Code Not Rotating
- Check browser console for token fetch errors
- Verify backend `/sessions/:id/token` endpoint is accessible
- Ensure session is active and not expired

### Tokens Always Invalid
- Check server time is synchronized
- Verify JWT_SECRET is same across all server instances
- Clear browser cache and retry

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is developed for educational purposes as part of a QR-Based Attendance Management System.

---

## 👥 Authors

- **Your Name** - Initial work and development

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for blazing fast development
- MongoDB for flexible data storage
- Lucide for beautiful icons
- All open-source contributors

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review API endpoints and error messages

---

**Built with ❤️ using React, Node.js, and MongoDB**
