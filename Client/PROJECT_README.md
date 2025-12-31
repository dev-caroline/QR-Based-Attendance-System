# QR-Based Attendance System - Frontend

A modern, responsive frontend application for managing lecture attendance using QR codes, built with React and Vite.

## 🎨 Features

### Pages Implemented

1. **Authentication Pages**
   - Login Page - Lecturer authentication with email and password
   - Registration Page - New lecturer account creation

2. **Dashboard & Analytics**
   - Attendance Records - View student attendance with statistics
   - Attendance Reports - Generate and export detailed reports
   - Course filters and date range selection
   - Real-time attendance percentage tracking

3. **Course Management**
   - Create, edit, and delete courses
   - View enrolled student counts
   - Search functionality for courses

4. **Session Management**
   - Active Sessions - Monitor live attendance sessions
   - Past Sessions - Review completed sessions
   - Session analytics and attendance counts

5. **QR Code Display**
   - Full-screen QR code display for student scanning
   - Countdown timer for session duration
   - Download and share QR code functionality

6. **Manual Requests**
   - Review student attendance requests
   - Approve/reject requests with reasons
   - Filter by status (pending, approved, rejected)
   - Pagination support

7. **Settings**
   - Profile management
   - Password change
   - Notification preferences
   - Account customization

## 🚀 Tech Stack

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **QRCode.react** - QR code generation
- **CSS3** - Custom styling with gradients and animations

## 📁 Project Structure

```
Client/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Registration.jsx
│   │   ├── AttendanceRecords.jsx
│   │   ├── AttendanceReports.jsx
│   │   ├── CoursesManagement.jsx
│   │   ├── SessionManagement.jsx
│   │   ├── ManualRequests.jsx
│   │   ├── Settings.jsx
│   │   └── QRCodeSession.jsx
│   ├── components/
│   │   └── Layout.jsx
│   ├── styles/
│   │   ├── Login.css
│   │   ├── Registration.css
│   │   ├── Layout.css
│   │   ├── AttendanceRecords.css
│   │   ├── AttendanceReports.css
│   │   ├── CoursesManagement.css
│   │   ├── SessionManagement.css
│   │   ├── ManualRequests.css
│   │   ├── Settings.css
│   │   └── QRCodeSession.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## 🎯 Key Features

### Design Highlights
- **Gradient UI** - Purple gradient theme (primary: #667eea, secondary: #764ba2)
- **Responsive Design** - Mobile-first approach, works on all screen sizes
- **Modern Components** - Card-based layouts with smooth animations
- **Icon Integration** - Lucide React icons throughout the interface
- **Form Validation** - Real-time validation on forms
- **Interactive Elements** - Hover effects, transitions, and micro-animations

### Navigation
- **Sidebar Navigation** - Collapsible sidebar with icon labels
- **Top Navbar** - Profile section with notifications
- **Protected Routes** - Authentication-based route protection
- **Breadcrumb Navigation** - Clear page hierarchy

### Data Visualization
- **Statistics Cards** - Color-coded stats for quick insights
- **Data Tables** - Sortable, searchable tables with pagination
- **Progress Bars** - Visual attendance percentage indicators
- **Status Badges** - Color-coded status indicators

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   cd Client
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🌐 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | Lecturer login page |
| `/register` | Registration | New account registration |
| `/dashboard` | AttendanceRecords | Main dashboard with attendance overview |
| `/reports` | AttendanceReports | Generate attendance reports |
| `/courses` | CoursesManagement | Manage courses |
| `/sessions` | SessionManagement | View active and past sessions |
| `/manual-requests` | ManualRequests | Review manual attendance requests |
| `/settings` | Settings | Account settings and preferences |
| `/session/:id/qr-code` | QRCodeSession | Full-screen QR code display |

## 🎨 Color Palette

- **Primary Purple**: `#667eea`
- **Secondary Purple**: `#764ba2`
- **Success Green**: `#48bb78`
- **Warning Orange**: `#f6ad55`
- **Danger Red**: `#f56565`
- **Background**: `#f7fafc`
- **Text Dark**: `#1a202c`
- **Text Medium**: `#2d3748`
- **Text Light**: `#718096`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 968px
- **Desktop**: > 968px

## ⚡ Performance Optimizations

- Vite for fast hot module replacement (HMR)
- Lazy loading of routes (can be implemented)
- Optimized images and assets
- Minimal CSS bundle sizes
- Tree-shaking for unused code

## 🔐 Security Features

- Password visibility toggle
- Form validation
- Protected routes (ready for authentication integration)
- Secure navigation flow

## 🚀 Future Enhancements

- [ ] Connect to backend API
- [ ] Implement real authentication
- [ ] Add chart visualizations (Chart.js or Recharts)
- [ ] Email notifications
- [ ] Export reports to PDF/Excel
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and sorting
- [ ] Bulk operations

## 📝 Development Notes

- All pages are fully responsive
- UI/UX follows the provided design mockups
- Modular component structure for easy maintenance
- Consistent styling across all pages
- Ready for backend integration

## 🤝 Contributing

This is a student attendance management system. To contribute:
1. Follow the existing code structure
2. Maintain consistent styling
3. Test responsiveness on multiple devices
4. Document any new features

## 📄 License

This project is part of the QR-Based Attendance System.

---

**Built with ❤️ using React + Vite**
