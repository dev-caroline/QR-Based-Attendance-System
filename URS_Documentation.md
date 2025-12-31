# USER REQUIREMENTS SPECIFICATION (URS)
## QR-Based Attendance System

---

**Document Version:** 1.0  
**Date:** December 31, 2025  
**Project:** QR-Based Attendance System  
**Author:** Development Team  
**Status:** Final

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [User Roles and Characteristics](#3-user-roles-and-characteristics)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Interface Requirements](#6-user-interface-requirements)
7. [Data Requirements](#7-data-requirements)
8. [Security Requirements](#8-security-requirements)
9. [System Constraints](#9-system-constraints)
10. [Assumptions and Dependencies](#10-assumptions-and-dependencies)
11. [Acceptance Criteria](#11-acceptance-criteria)

---

## 1. INTRODUCTION

### 1.1 Purpose
This document specifies the user requirements for the QR-Based Attendance System, a web-based application designed to streamline the process of recording and managing student attendance in educational institutions using QR code technology.

### 1.2 Scope
The system shall provide:
- Digital attendance tracking via QR code scanning
- Real-time attendance monitoring for lecturers
- Course and session management
- Manual attendance request handling
- Attendance statistics and reporting
- Notification system for attendance-related events

### 1.3 Intended Audience
- **Lecturers:** Primary users who manage courses, sessions, and attendance
- **Students:** Secondary users who mark attendance via QR scanning
- **System Administrators:** Technical staff maintaining the system
- **Stakeholders:** Educational institution management

### 1.4 Document Conventions
- **SHALL:** Mandatory requirement
- **SHOULD:** Recommended requirement
- **MAY:** Optional requirement
- **User:** Refers to authenticated lecturer
- **Student:** Refers to non-authenticated student accessing public features

### 1.5 References
- System Architecture Documentation
- Database Schema Documentation
- API Documentation
- Security Standards and Protocols

---

## 2. SYSTEM OVERVIEW

### 2.1 System Description
The QR-Based Attendance System is a modern web application that replaces traditional paper-based attendance tracking with a digital QR code solution. The system enables lecturers to generate unique QR codes for each session, which students scan using their mobile devices to mark attendance automatically.

### 2.2 System Architecture
- **Frontend:** React 19.2.0 with Vite build system
- **Backend:** Node.js with Express 5.2.1 framework
- **Database:** MongoDB Atlas (cloud-hosted)
- **Authentication:** JWT-based token authentication
- **Real-time Updates:** Polling mechanism for notifications

### 2.3 Key Features
1. QR code generation for attendance sessions
2. Mobile-friendly QR scanning interface
3. IP-based duplicate detection
4. Manual attendance request workflow
5. Real-time attendance statistics
6. Bulk student enrollment
7. Notification system
8. Session duration management

---

## 3. USER ROLES AND CHARACTERISTICS

### 3.1 Lecturer (Authenticated User)

**Profile:**
- Faculty members responsible for teaching courses
- Primary system users with full access
- Technically proficient with web applications

**Responsibilities:**
- Create and manage courses
- Conduct attendance sessions
- Review and approve manual requests
- Monitor attendance statistics
- Manage student enrollments

**Access Level:** Full authenticated access with JWT token

### 3.2 Student (Non-Authenticated User)

**Profile:**
- Enrolled students attending courses
- Limited access to public features only
- Uses mobile devices for QR scanning

**Responsibilities:**
- Scan QR codes to mark attendance
- Submit manual attendance requests when necessary
- Provide accurate matric number for identification

**Access Level:** Public access to QR scanning and manual request submission

### 3.3 System Administrator

**Profile:**
- Technical staff managing system infrastructure
- Database administrators
- DevOps personnel

**Responsibilities:**
- System maintenance and monitoring
- Database management
- Security updates
- Performance optimization

**Access Level:** Backend server and database access

---

## 4. FUNCTIONAL REQUIREMENTS

### 4.1 Authentication and Authorization

#### FR-1.1: User Registration
**Priority:** HIGH  
**Description:** The system SHALL allow new lecturers to register with required credentials.

**Requirements:**
- FR-1.1.1: System SHALL require full name, email, password, and confirm password
- FR-1.1.2: Email SHALL be unique in the system
- FR-1.1.3: Password SHALL be at least 6 characters long
- FR-1.1.4: System SHALL validate password confirmation matches
- FR-1.1.5: System SHALL hash passwords before storage using bcrypt
- FR-1.1.6: Upon successful registration, user SHALL be redirected to login page

#### FR-1.2: User Login
**Priority:** HIGH  
**Description:** The system SHALL authenticate registered users and provide secure access.

**Requirements:**
- FR-1.2.1: System SHALL require email and password for login
- FR-1.2.2: System SHALL validate credentials against stored records
- FR-1.2.3: System SHALL generate JWT token upon successful authentication
- FR-1.2.4: Token SHALL expire after 30 days
- FR-1.2.5: System SHALL store token in browser localStorage
- FR-1.2.6: System SHALL redirect authenticated users to dashboard

#### FR-1.3: Session Management
**Priority:** HIGH  
**Description:** The system SHALL maintain user authentication state.

**Requirements:**
- FR-1.3.1: System SHALL verify JWT token on protected route access
- FR-1.3.2: Invalid/expired tokens SHALL redirect to login page
- FR-1.3.3: System SHALL provide logout functionality
- FR-1.3.4: Logout SHALL clear authentication tokens
- FR-1.3.5: System SHALL display loading state during authentication check

### 4.2 Course Management

#### FR-2.1: Create Course
**Priority:** HIGH  
**Description:** The system SHALL allow lecturers to create new courses.

**Requirements:**
- FR-2.1.1: System SHALL require course code and course name
- FR-2.1.2: Course code SHALL be unique per lecturer
- FR-2.1.3: System SHALL automatically assign lecturer as course owner
- FR-2.1.4: System SHALL initialize empty student list
- FR-2.1.5: System SHALL auto-calculate student count
- FR-2.1.6: System SHALL display success confirmation upon creation

#### FR-2.2: Update Course
**Priority:** MEDIUM  
**Description:** The system SHALL allow lecturers to modify course details.

**Requirements:**
- FR-2.2.1: Lecturers SHALL only edit their own courses
- FR-2.2.2: System SHALL allow updating course code, name, and students
- FR-2.2.3: System SHALL validate updated course code uniqueness
- FR-2.2.4: System SHALL recalculate student count on update
- FR-2.2.5: Changes SHALL be reflected immediately in course list

#### FR-2.3: Delete Course
**Priority:** MEDIUM  
**Description:** The system SHALL allow lecturers to remove courses.

**Requirements:**
- FR-2.3.1: System SHALL require confirmation before deletion
- FR-2.3.2: Only course owner SHALL delete their courses
- FR-2.3.3: System SHALL cascade delete related sessions
- FR-2.3.4: System SHALL remove course from display after deletion

#### FR-2.4: View Courses
**Priority:** HIGH  
**Description:** The system SHALL display all courses created by the lecturer.

**Requirements:**
- FR-2.4.1: System SHALL show course code, name, and student count
- FR-2.4.2: System SHALL provide search functionality by code or name
- FR-2.4.3: System SHALL display courses in card grid layout
- FR-2.4.4: System SHALL show action buttons for edit, delete, and manage students

#### FR-2.5: Bulk Student Enrollment
**Priority:** HIGH  
**Description:** The system SHALL allow adding multiple students at once.

**Requirements:**
- FR-2.5.1: System SHALL provide textarea for matric numbers (one per line)
- FR-2.5.2: System SHALL auto-convert matric numbers to uppercase
- FR-2.5.3: System SHALL trim whitespace from entries
- FR-2.5.4: System SHALL remove empty lines
- FR-2.5.5: System SHALL update student count after enrollment
- FR-2.5.6: System SHALL show enrolled students in modal
- FR-2.5.7: System SHALL allow editing existing student list

### 4.3 Session Management

#### FR-3.1: Create Session
**Priority:** HIGH  
**Description:** The system SHALL allow lecturers to start attendance sessions.

**Requirements:**
- FR-3.1.1: System SHALL require course selection
- FR-3.1.2: System SHALL require session name, date, and time
- FR-3.1.3: System SHALL require duration (5-60 minutes)
- FR-3.1.4: Location field SHALL be optional
- FR-3.1.5: System SHALL generate unique QR code with session ID
- FR-3.1.6: System SHALL set session status to "active"
- FR-3.1.7: System SHALL calculate expiration time from duration
- FR-3.1.8: System SHALL record startedAt timestamp
- FR-3.1.9: Upon creation, system SHALL redirect to QR display page

#### FR-3.2: Display QR Code
**Priority:** HIGH  
**Description:** The system SHALL present QR code for student scanning.

**Requirements:**
- FR-3.2.1: System SHALL display QR code centered on screen
- FR-3.2.2: System SHALL show session details (name, course, time)
- FR-3.2.3: System SHALL display remaining time countdown
- FR-3.2.4: System SHALL show attendance count
- FR-3.2.5: System SHALL provide "End Session" button
- FR-3.2.6: System SHALL provide "Close" button to return to sessions list
- FR-3.2.7: QR code SHALL be large and clear for scanning

#### FR-3.3: End Session
**Priority:** HIGH  
**Description:** The system SHALL allow manual session termination.

**Requirements:**
- FR-3.3.1: System SHALL require confirmation before ending
- FR-3.3.2: System SHALL set session status to "completed"
- FR-3.3.3: System SHALL record endedAt timestamp
- FR-3.3.4: System SHALL prevent new attendance after ending
- FR-3.3.5: Ended sessions SHALL appear in "Past Sessions" tab

#### FR-3.4: Delete Session
**Priority:** MEDIUM  
**Description:** The system SHALL allow removing past sessions.

**Requirements:**
- FR-3.4.1: System SHALL only allow deleting completed sessions
- FR-3.4.2: System SHALL require confirmation with warning message
- FR-3.4.3: System SHALL permanently remove session and related data
- FR-3.4.4: Delete button SHALL display trash icon in red

#### FR-3.5: View Sessions
**Priority:** HIGH  
**Description:** The system SHALL display sessions in organized tabs.

**Requirements:**
- FR-3.5.1: System SHALL show "Active" and "Past" tabs
- FR-3.5.2: Active tab SHALL display ongoing sessions
- FR-3.5.3: Past tab SHALL display completed sessions
- FR-3.5.4: Each session card SHALL show course code, name, date, time
- FR-3.5.5: Active sessions SHALL show "View QR" and "End" buttons
- FR-3.5.6: Past sessions SHALL show attendance count and delete button
- FR-3.5.7: System SHALL display "Live" badge on active sessions

### 4.4 Attendance Marking

#### FR-4.1: QR Code Scanning (Student)
**Priority:** HIGH  
**Description:** The system SHALL enable students to mark attendance via QR scan.

**Requirements:**
- FR-4.1.1: System SHALL load session details from QR URL
- FR-4.1.2: System SHALL check if session is active
- FR-4.1.3: System SHALL check if session has expired
- FR-4.1.4: System SHALL display session info (course, date, time)
- FR-4.1.5: System SHALL show remaining time if active
- FR-4.1.6: System SHALL provide matric number input field
- FR-4.1.7: System SHALL validate matric number is provided
- FR-4.1.8: System SHALL show appropriate messages for expired/inactive sessions

#### FR-4.2: Submit Attendance
**Priority:** HIGH  
**Description:** The system SHALL process and record attendance submissions.

**Requirements:**
- FR-4.2.1: System SHALL capture student's matric number
- FR-4.2.2: System SHALL capture client IP address
- FR-4.2.3: System SHALL capture device information from user agent
- FR-4.2.4: System SHALL check for duplicate IP submissions
- FR-4.2.5: System SHALL check for duplicate student submissions
- FR-4.2.6: System SHALL create attendance record with timestamp
- FR-4.2.7: System SHALL mark status as "present"
- FR-4.2.8: System SHALL show success message upon completion
- FR-4.2.9: System SHALL prevent multiple submissions from same device
- FR-4.2.10: System SHALL prevent multiple submissions from same student

#### FR-4.3: View Attendance Records
**Priority:** HIGH  
**Description:** The system SHALL display attendance data to lecturers.

**Requirements:**
- FR-4.3.1: System SHALL show attendance by course
- FR-4.3.2: System SHALL allow filtering by date
- FR-4.3.3: System SHALL display overall statistics (enrolled, present, absent, %)
- FR-4.3.4: System SHALL show per-student attendance details
- FR-4.3.5: System SHALL provide search functionality for students
- FR-4.3.6: System SHALL display student matric numbers
- FR-4.3.7: System SHALL show attendance counts and percentages
- FR-4.3.8: System SHALL use color-coded badges (green ≥90%, yellow ≥75%, red <75%)

### 4.5 Manual Attendance Requests

#### FR-5.1: Submit Manual Request (Student)
**Priority:** HIGH  
**Description:** The system SHALL allow students to request manual attendance.

**Requirements:**
- FR-5.1.1: System SHALL be accessible via /request public URL
- FR-5.1.2: System SHALL require matric number
- FR-5.1.3: System SHALL provide course dropdown
- FR-5.1.4: System SHALL filter sessions by selected course
- FR-5.1.5: System SHALL show completed sessions only
- FR-5.1.6: System SHALL require reason for request
- FR-5.1.7: System SHALL validate all fields before submission
- FR-5.1.8: System SHALL prevent duplicate requests for same session
- FR-5.1.9: System SHALL check if attendance already marked
- FR-5.1.10: System SHALL create notification for lecturer
- FR-5.1.11: System SHALL show success confirmation

#### FR-5.2: View Manual Requests (Lecturer)
**Priority:** HIGH  
**Description:** The system SHALL display pending requests to lecturers.

**Requirements:**
- FR-5.2.1: System SHALL show requests for lecturer's sessions only
- FR-5.2.2: System SHALL provide filter tabs (All, Pending, Approved, Rejected)
- FR-5.2.3: System SHALL display student matric number
- FR-5.2.4: System SHALL show course code and session name
- FR-5.2.5: System SHALL display submission date and reason
- FR-5.2.6: System SHALL show status badge with color coding
- FR-5.2.7: System SHALL provide search functionality
- FR-5.2.8: System SHALL paginate results

#### FR-5.3: Approve Request
**Priority:** HIGH  
**Description:** The system SHALL allow lecturers to approve requests.

**Requirements:**
- FR-5.3.1: System SHALL require confirmation before approval
- FR-5.3.2: System SHALL create attendance record upon approval
- FR-5.3.3: System SHALL update request status to "approved"
- FR-5.3.4: System SHALL record reviewer and timestamp
- FR-5.3.5: System SHALL allow optional approval note
- FR-5.3.6: System SHALL create notification for student
- FR-5.3.7: System SHALL add attendance to session count

#### FR-5.4: Reject Request
**Priority:** HIGH  
**Description:** The system SHALL allow lecturers to reject requests.

**Requirements:**
- FR-5.4.1: System SHALL require confirmation before rejection
- FR-5.4.2: System SHALL update request status to "rejected"
- FR-5.4.3: System SHALL record reviewer and timestamp
- FR-5.4.4: System SHALL require rejection reason/note
- FR-5.4.5: System SHALL create notification for student
- FR-5.4.6: System SHALL NOT create attendance record

### 4.6 Notification System

#### FR-6.1: Create Notifications
**Priority:** MEDIUM  
**Description:** The system SHALL generate notifications for key events.

**Requirements:**
- FR-6.1.1: System SHALL create notification on new manual request
- FR-6.1.2: System SHALL create notification on request approval
- FR-6.1.3: System SHALL create notification on request rejection
- FR-6.1.4: Notifications SHALL include title and message
- FR-6.1.5: Notifications SHALL link to related record
- FR-6.1.6: System SHALL set notification type based on event

#### FR-6.2: Display Notifications
**Priority:** MEDIUM  
**Description:** The system SHALL show notifications in navbar.

**Requirements:**
- FR-6.2.1: System SHALL show bell icon with unread count
- FR-6.2.2: Badge SHALL display number of unread notifications
- FR-6.2.3: Clicking bell SHALL open dropdown
- FR-6.2.4: Dropdown SHALL show most recent 10 notifications
- FR-6.2.5: Unread notifications SHALL have blue background
- FR-6.2.6: Each notification SHALL show title, message, and time
- FR-6.2.7: System SHALL auto-refresh every 30 seconds

#### FR-6.3: Manage Notifications
**Priority:** MEDIUM  
**Description:** The system SHALL allow notification management.

**Requirements:**
- FR-6.3.1: Clicking notification SHALL mark as read
- FR-6.3.2: System SHALL provide "Mark all as read" button
- FR-6.3.3: System SHALL allow individual notification deletion
- FR-6.3.4: Read notifications SHALL have normal background
- FR-6.3.5: System SHALL update unread count in real-time

### 4.7 User Profile Management

#### FR-7.1: Update Profile
**Priority:** MEDIUM  
**Description:** The system SHALL allow users to update profile information.

**Requirements:**
- FR-7.1.1: System SHALL allow updating full name
- FR-7.1.2: System SHALL allow updating email address
- FR-7.1.3: System SHALL validate email uniqueness
- FR-7.1.4: System SHALL allow profile photo upload
- FR-7.1.5: Photo SHALL be stored as base64 string
- FR-7.1.6: Photo size SHALL be limited to 5MB
- FR-7.1.7: System SHALL provide photo preview
- FR-7.1.8: System SHALL allow photo removal
- FR-7.1.9: Changes SHALL persist in database
- FR-7.1.10: System SHALL show success confirmation

#### FR-7.2: Change Password
**Priority:** MEDIUM  
**Description:** The system SHALL enable password changes.

**Requirements:**
- FR-7.2.1: System SHALL require current password
- FR-7.2.2: System SHALL validate current password
- FR-7.2.3: System SHALL require new password (min 6 characters)
- FR-7.2.4: System SHALL require password confirmation
- FR-7.2.5: System SHALL validate new passwords match
- FR-7.2.6: System SHALL hash new password before storage
- FR-7.2.7: System SHALL show success message
- FR-7.2.8: System SHALL provide password visibility toggles

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Performance Requirements

#### NFR-1.1: Response Time
**Priority:** HIGH
- NFR-1.1.1: API responses SHALL complete within 2 seconds under normal load
- NFR-1.1.2: QR code page SHALL load within 1 second
- NFR-1.1.3: Dashboard statistics SHALL load within 3 seconds
- NFR-1.1.4: Search results SHALL display within 500ms

#### NFR-1.2: Scalability
**Priority:** MEDIUM
- NFR-1.2.1: System SHALL support 100 concurrent users
- NFR-1.2.2: System SHALL handle 1000 attendance records per session
- NFR-1.2.3: Database SHALL support minimum 10,000 students
- NFR-1.2.4: System SHALL maintain performance with 500+ courses

#### NFR-1.3: Availability
**Priority:** HIGH
- NFR-1.3.1: System SHALL maintain 99% uptime during academic terms
- NFR-1.3.2: Planned maintenance SHALL occur outside class hours
- NFR-1.3.3: System SHALL provide graceful degradation on failures

### 5.2 Usability Requirements

#### NFR-2.1: User Interface
**Priority:** HIGH
- NFR-2.1.1: Interface SHALL be intuitive requiring minimal training
- NFR-2.1.2: System SHALL use consistent design patterns
- NFR-2.1.3: Actions SHALL provide immediate feedback
- NFR-2.1.4: Error messages SHALL be clear and actionable
- NFR-2.1.5: Forms SHALL validate inputs client-side

#### NFR-2.2: Accessibility
**Priority:** MEDIUM
- NFR-2.2.1: System SHALL be usable on mobile devices (responsive design)
- NFR-2.2.2: QR codes SHALL be scannable from 1-3 feet distance
- NFR-2.2.3: Text SHALL maintain readable contrast ratios
- NFR-2.2.4: Buttons SHALL be adequately sized for touch input

#### NFR-2.3: Learnability
**Priority:** MEDIUM
- NFR-2.3.1: New users SHALL complete first session within 10 minutes
- NFR-2.3.2: Students SHALL mark attendance within 30 seconds
- NFR-2.3.3: System SHALL provide contextual help messages

### 5.3 Security Requirements

#### NFR-3.1: Authentication Security
**Priority:** HIGH
- NFR-3.1.1: Passwords SHALL be hashed using bcrypt (10 rounds)
- NFR-3.1.2: JWT tokens SHALL use secure signing algorithm
- NFR-3.1.3: Tokens SHALL include expiration timestamps
- NFR-3.1.4: System SHALL validate tokens on each protected request

#### NFR-3.2: Authorization Security
**Priority:** HIGH
- NFR-3.2.1: Lecturers SHALL only access their own data
- NFR-3.2.2: Public endpoints SHALL be limited to necessary functionality
- NFR-3.2.3: System SHALL verify resource ownership before operations
- NFR-3.2.4: Role-based access control SHALL be enforced

#### NFR-3.3: Data Protection
**Priority:** HIGH
- NFR-3.3.1: Sensitive data SHALL be transmitted over HTTPS
- NFR-3.3.2: Database connections SHALL use encrypted channels
- NFR-3.3.3: IP addresses SHALL be logged for security auditing
- NFR-3.3.4: System SHALL prevent SQL/NoSQL injection attacks
- NFR-3.3.5: System SHALL sanitize all user inputs

### 5.4 Reliability Requirements

#### NFR-4.1: Data Integrity
**Priority:** HIGH
- NFR-4.1.1: Database operations SHALL be ACID-compliant
- NFR-4.1.2: Attendance records SHALL be immutable once created
- NFR-4.1.3: System SHALL prevent duplicate attendance entries
- NFR-4.1.4: System SHALL maintain data consistency across collections

#### NFR-4.2: Error Handling
**Priority:** HIGH
- NFR-4.2.1: System SHALL handle errors gracefully without crashes
- NFR-4.2.2: Failed operations SHALL not corrupt database state
- NFR-4.2.3: System SHALL log errors for debugging
- NFR-4.2.4: Users SHALL receive meaningful error messages

#### NFR-4.3: Backup and Recovery
**Priority:** MEDIUM
- NFR-4.3.1: Database SHALL be backed up daily
- NFR-4.3.2: System SHALL support data restoration
- NFR-4.3.3: Backup retention SHALL be minimum 30 days

### 5.5 Maintainability Requirements

#### NFR-5.1: Code Quality
**Priority:** MEDIUM
- NFR-5.1.1: Code SHALL follow consistent style guidelines
- NFR-5.1.2: Functions SHALL be modular and reusable
- NFR-5.1.3: Code SHALL avoid unnecessary comments
- NFR-5.1.4: Components SHALL have single responsibility

#### NFR-5.2: Documentation
**Priority:** MEDIUM
- NFR-5.2.1: API endpoints SHALL be documented
- NFR-5.2.2: Database schema SHALL be documented
- NFR-5.2.3: Setup instructions SHALL be provided
- NFR-5.2.4: System architecture SHALL be diagrammed

### 5.6 Compatibility Requirements

#### NFR-6.1: Browser Support
**Priority:** HIGH
- NFR-6.1.1: System SHALL support Chrome (latest 2 versions)
- NFR-6.1.2: System SHALL support Firefox (latest 2 versions)
- NFR-6.1.3: System SHALL support Safari (latest 2 versions)
- NFR-6.1.4: System SHALL support Edge (latest 2 versions)

#### NFR-6.2: Device Support
**Priority:** HIGH
- NFR-6.2.1: System SHALL function on smartphones (iOS/Android)
- NFR-6.2.2: System SHALL function on tablets
- NFR-6.2.3: System SHALL function on desktop computers
- NFR-6.2.4: QR scanning SHALL work on mobile cameras

#### NFR-6.3: Network Requirements
**Priority:** MEDIUM
- NFR-6.3.1: System SHALL function on 3G or better connection
- NFR-6.3.2: System SHALL handle intermittent connectivity gracefully
- NFR-6.3.3: QR codes SHALL load on slow networks

---

## 6. USER INTERFACE REQUIREMENTS

### 6.1 General UI Requirements

#### UIR-1: Design Consistency
- UIR-1.1: System SHALL use consistent color scheme (purple primary, gray secondary)
- UIR-1.2: Buttons SHALL have uniform styling and hover effects
- UIR-1.3: Cards SHALL have consistent shadow and border radius
- UIR-1.4: Typography SHALL be consistent across pages

#### UIR-2: Navigation
- UIR-2.1: Sidebar SHALL be present on all authenticated pages
- UIR-2.2: Navbar SHALL show user profile and notifications
- UIR-2.3: Active menu item SHALL be highlighted
- UIR-2.4: Logo SHALL link to dashboard

#### UIR-3: Feedback
- UIR-3.1: Success messages SHALL be green
- UIR-3.2: Error messages SHALL be red
- UIR-3.3: Loading states SHALL show spinner animation
- UIR-3.4: Confirmations SHALL use modal dialogs

### 6.2 Page-Specific Requirements

#### UIR-4: Login/Registration
- UIR-4.1: Form SHALL be centered on page
- UIR-4.2: Password fields SHALL have visibility toggle
- UIR-4.3: Submit button SHALL be disabled during processing
- UIR-4.4: Link to alternate page SHALL be provided (login ↔ register)

#### UIR-5: Dashboard
- UIR-5.1: Statistics cards SHALL display key metrics
- UIR-5.2: Course selector SHALL be dropdown
- UIR-5.3: Date picker SHALL use calendar widget
- UIR-5.4: Student table SHALL be sortable and searchable
- UIR-5.5: Color-coded percentage badges SHALL be used

#### UIR-6: Courses Page
- UIR-6.1: Courses SHALL display in grid layout
- UIR-6.2: Search bar SHALL be prominent at top
- UIR-6.3: Create button SHALL be clearly visible
- UIR-6.4: Course cards SHALL show code, name, and student count
- UIR-6.5: Action buttons SHALL use icons (edit, delete, users)

#### UIR-7: Sessions Page
- UIR-7.1: Tabs SHALL separate active and past sessions
- UIR-7.2: Create button SHALL be in header
- UIR-7.3: Session cards SHALL show live badge for active
- UIR-7.4: QR button SHALL be prominent on active sessions
- UIR-7.5: Delete button SHALL be small and red on past sessions

#### UIR-8: QR Code Display
- UIR-8.1: QR code SHALL be centered and large
- UIR-8.2: Session details SHALL be above QR code
- UIR-8.3: Countdown timer SHALL be visible
- UIR-8.4: Close button SHALL be in top-right corner
- UIR-8.5: End session button SHALL be below QR code

#### UIR-9: Student Attendance Page
- UIR-9.1: Session info SHALL be in card format
- UIR-9.2: Matric number input SHALL be clearly labeled
- UIR-9.3: Submit button SHALL be prominent
- UIR-9.4: Status messages SHALL use icons (check, x, clock)
- UIR-9.5: Manual request link SHALL be provided

#### UIR-10: Manual Requests
- UIR-10.1: Filter tabs SHALL be at top
- UIR-10.2: Search bar SHALL filter table
- UIR-10.3: Table SHALL show matric, course, session, status
- UIR-10.4: Status badges SHALL be color-coded
- UIR-10.5: Action buttons SHALL be in table rows
- UIR-10.6: Pagination SHALL be at bottom

---

## 7. DATA REQUIREMENTS

### 7.1 Data Entities

#### DR-1: User (Lecturer)
**Attributes:**
- _id: ObjectId (Primary Key)
- fullName: String (Required)
- email: String (Required, Unique)
- password: String (Required, Hashed)
- role: String (Default: "lecturer")
- profileImage: String (Base64)
- timestamps: Date (createdAt, updatedAt)

**Relationships:**
- One User → Many Courses
- One User → Many Notifications
- One User → Many ManualRequests (as reviewer)

#### DR-2: Course
**Attributes:**
- _id: ObjectId (Primary Key)
- code: String (Required, Unique per lecturer)
- name: String (Required)
- lecturer: ObjectId (Reference to User)
- students: Array of Strings (Matric numbers)
- studentCount: Number (Auto-calculated)
- timestamps: Date (createdAt, updatedAt)

**Relationships:**
- One Course → Many Sessions
- One Course → Many Attendance Records

#### DR-3: Session
**Attributes:**
- _id: ObjectId (Primary Key)
- course: ObjectId (Reference to Course)
- lecturer: ObjectId (Reference to User)
- sessionName: String (Required)
- date: Date (Required)
- time: String (Required)
- location: String (Optional)
- duration: Number (Minutes, Default: 10)
- status: String (Enum: active, completed)
- qrCode: String (URL)
- startedAt: Date
- endedAt: Date
- expiresAt: Date (Calculated from duration)
- timestamps: Date (createdAt, updatedAt)

**Relationships:**
- One Session → Many Attendance Records
- One Session → Many ManualRequests

#### DR-4: Attendance
**Attributes:**
- _id: ObjectId (Primary Key)
- session: ObjectId (Reference to Session)
- course: ObjectId (Reference to Course)
- student: String (Matric number)
- status: String (Default: "present")
- markedAt: Date (Default: now)
- ipAddress: String
- deviceInfo: String
- timestamps: Date (createdAt, updatedAt)

**Indexes:**
- Unique: (session, student)
- Index: (session, ipAddress)

#### DR-5: ManualRequest
**Attributes:**
- _id: ObjectId (Primary Key)
- student: String (Matric number, Required)
- session: ObjectId (Reference to Session)
- course: ObjectId (Reference to Course)
- reason: String (Required)
- status: String (Enum: pending, approved, rejected)
- reviewedBy: ObjectId (Reference to User)
- reviewedAt: Date
- reviewNote: String
- timestamps: Date (createdAt, updatedAt)

#### DR-6: Notification
**Attributes:**
- _id: ObjectId (Primary Key)
- user: ObjectId (Reference to User)
- type: String (Enum: manual_request, session_reminder, course_update, general)
- title: String (Required)
- message: String (Required)
- isRead: Boolean (Default: false)
- relatedId: ObjectId
- relatedModel: String (Enum: ManualRequest, Session, Course)
- timestamps: Date (createdAt, updatedAt)

**Indexes:**
- Index: (user, isRead)

### 7.2 Data Validation Rules

#### DR-7: Validation Requirements
- DR-7.1: Email SHALL match valid email format
- DR-7.2: Matric numbers SHALL be trimmed and uppercased
- DR-7.3: Passwords SHALL be minimum 6 characters
- DR-7.4: Course codes SHALL be alphanumeric
- DR-7.5: Duration SHALL be between 5-60 minutes
- DR-7.6: Dates SHALL be valid date objects
- DR-7.7: ObjectId references SHALL exist in database

### 7.3 Data Retention

#### DR-8: Retention Policies
- DR-8.1: User accounts SHALL be retained indefinitely unless deleted
- DR-8.2: Course data SHALL be retained for academic year + 1 year
- DR-8.3: Attendance records SHALL be retained for 3 years
- DR-8.4: Sessions SHALL be retained permanently
- DR-8.5: Notifications SHALL be retained for 90 days
- DR-8.6: Manual requests SHALL be retained for 1 year

---

## 8. SECURITY REQUIREMENTS

### 8.1 Authentication Security

#### SR-1: Password Security
- SR-1.1: Passwords SHALL be hashed using bcrypt with salt rounds of 10
- SR-1.2: Passwords SHALL NOT be stored in plain text
- SR-1.3: Password reset SHALL require email verification
- SR-1.4: Failed login attempts SHALL be tracked

#### SR-2: Token Security
- SR-2.1: JWT tokens SHALL use HS256 algorithm
- SR-2.2: Tokens SHALL include user ID and expiration
- SR-2.3: Tokens SHALL expire after 30 days
- SR-2.4: Tokens SHALL be stored in localStorage on client
- SR-2.5: Invalid tokens SHALL be rejected with 401 status

### 8.2 Authorization Security

#### SR-3: Access Control
- SR-3.1: Protected routes SHALL require valid JWT token
- SR-3.2: Lecturers SHALL only access their own resources
- SR-3.3: Course ownership SHALL be verified on modifications
- SR-3.4: Session ownership SHALL be verified on modifications
- SR-3.5: Manual requests SHALL only be viewed by session owner

#### SR-4: Public Endpoint Security
- SR-4.1: QR scanning endpoint SHALL be rate-limited
- SR-4.2: Manual request endpoint SHALL validate session existence
- SR-4.3: Public endpoints SHALL sanitize inputs
- SR-4.4: IP tracking SHALL prevent spam submissions

### 8.3 Data Security

#### SR-5: Data Protection
- SR-5.1: All API communications SHALL use HTTPS in production
- SR-5.2: Database connection strings SHALL be stored in environment variables
- SR-5.3: Sensitive data SHALL NOT be logged
- SR-5.4: User inputs SHALL be sanitized to prevent injection

#### SR-6: IP and Device Tracking
- SR-6.1: IP addresses SHALL be captured on attendance submission
- SR-6.2: Device information SHALL be captured from user agent
- SR-6.3: Duplicate IP submissions SHALL be prevented per session
- SR-6.4: IP data SHALL be used for security auditing only

### 8.4 Session Security

#### SR-7: Session Management
- SR-7.1: QR codes SHALL expire based on session duration
- SR-7.2: Expired sessions SHALL reject new attendance
- SR-7.3: Session IDs SHALL be unpredictable (MongoDB ObjectId)
- SR-7.4: Session URLs SHALL include validation tokens

---

## 9. SYSTEM CONSTRAINTS

### 9.1 Technical Constraints

#### CON-1: Technology Stack
- CON-1.1: Frontend SHALL use React 19.2.0
- CON-1.2: Backend SHALL use Node.js with Express 5.2.1
- CON-1.3: Database SHALL be MongoDB Atlas
- CON-1.4: Authentication SHALL use JWT
- CON-1.5: QR codes SHALL use react-qr-code library

#### CON-2: Development Constraints
- CON-2.1: System SHALL use JavaScript/JSX
- CON-2.2: Styling SHALL use Tailwind CSS and custom CSS
- CON-2.3: API SHALL be RESTful
- CON-2.4: Build tool SHALL be Vite

#### CON-3: Deployment Constraints
- CON-3.1: Frontend SHALL run on port 5174 (development)
- CON-3.2: Backend SHALL run on port 3500
- CON-3.3: Database SHALL be cloud-hosted (MongoDB Atlas)
- CON-3.4: Environment variables SHALL configure sensitive data

### 9.2 Business Constraints

#### CON-4: User Constraints
- CON-4.1: Students SHALL NOT require user accounts
- CON-4.2: Only lecturers SHALL have authenticated access
- CON-4.3: Student identification SHALL use matric numbers only
- CON-4.4: No email verification required for students

#### CON-5: Operational Constraints
- CON-5.1: System SHALL operate during class hours
- CON-5.2: QR codes SHALL be displayed on lecturer's device
- CON-5.3: Students SHALL use personal mobile devices
- CON-5.4: Internet connectivity SHALL be required

---

## 10. ASSUMPTIONS AND DEPENDENCIES

### 10.1 Assumptions

#### ASM-1: User Assumptions
- ASM-1.1: Lecturers have basic computer literacy
- ASM-1.2: Students have smartphones with cameras
- ASM-1.3: Students have QR scanning capability
- ASM-1.4: Matric numbers are unique per student
- ASM-1.5: Students will honestly use their own matric numbers

#### ASM-2: Infrastructure Assumptions
- ASM-2.1: Stable internet connection available in classrooms
- ASM-2.2: Lecturer devices can display QR codes clearly
- ASM-2.3: MongoDB Atlas service is reliable
- ASM-2.4: Client devices support modern web browsers

#### ASM-3: Operational Assumptions
- ASM-3.1: Lecturers will enroll students before sessions
- ASM-3.2: Sessions will be created before class time
- ASM-3.3: QR codes will be displayed for full duration
- ASM-3.4: Manual requests will be reviewed promptly

### 10.2 Dependencies

#### DEP-1: External Dependencies
- DEP-1.1: MongoDB Atlas cloud service availability
- DEP-1.2: npm package registry availability
- DEP-1.3: Browser QR scanning libraries
- DEP-1.4: JWT library for token generation
- DEP-1.5: bcrypt library for password hashing

#### DEP-2: Internal Dependencies
- DEP-2.1: Frontend depends on Backend API
- DEP-2.2: Authentication depends on database connectivity
- DEP-2.3: Notifications depend on manual request workflow
- DEP-2.4: Statistics depend on attendance records

#### DEP-3: Network Dependencies
- DEP-3.1: System depends on stable internet
- DEP-3.2: QR scanning depends on network connectivity
- DEP-3.3: Real-time updates depend on polling mechanism

---

## 11. ACCEPTANCE CRITERIA

### 11.1 Functional Acceptance

#### AC-1: Authentication
- ✓ Lecturer can successfully register with valid credentials
- ✓ Lecturer can log in with correct email/password
- ✓ Invalid credentials are rejected with appropriate message
- ✓ Authenticated user can access protected pages
- ✓ Unauthenticated user is redirected to login
- ✓ User can log out and session is cleared

#### AC-2: Course Management
- ✓ Lecturer can create new course with code and name
- ✓ Lecturer can view all their courses in grid layout
- ✓ Lecturer can search courses by code or name
- ✓ Lecturer can edit course details
- ✓ Lecturer can delete course with confirmation
- ✓ Lecturer can bulk enroll students via textarea
- ✓ Student count updates automatically

#### AC-3: Session Management
- ✓ Lecturer can create session with all required fields
- ✓ QR code is generated and displayed clearly
- ✓ Session details shown on QR page
- ✓ Countdown timer shows remaining time
- ✓ Lecturer can end session manually
- ✓ Lecturer can delete past sessions
- ✓ Active and past sessions show in separate tabs

#### AC-4: Attendance Marking
- ✓ Student can access QR scan page via link
- ✓ Session info displays correctly to student
- ✓ Expired sessions show appropriate message
- ✓ Student can enter matric number and submit
- ✓ Duplicate submissions are prevented
- ✓ Same device cannot submit twice
- ✓ Success message displays on completion
- ✓ Attendance is recorded in database

#### AC-5: Manual Requests
- ✓ Student can access /request page without login
- ✓ Student can select course and session
- ✓ Student can submit request with reason
- ✓ Duplicate requests are prevented
- ✓ Lecturer receives notification of new request
- ✓ Lecturer can view all requests with filters
- ✓ Lecturer can approve request and create attendance
- ✓ Lecturer can reject request with note
- ✓ Student notification created on approval/rejection

#### AC-6: Statistics & Reporting
- ✓ Dashboard shows overall attendance statistics
- ✓ Per-student attendance details displayed
- ✓ Attendance can be filtered by date
- ✓ Search functionality works for students
- ✓ Percentages calculated correctly
- ✓ Color-coded badges display appropriately

#### AC-7: Notifications
- ✓ Bell icon shows unread count
- ✓ Clicking bell opens dropdown with notifications
- ✓ Notifications auto-refresh every 30 seconds
- ✓ Clicking notification marks as read
- ✓ Mark all as read button functions
- ✓ Unread notifications have blue background

#### AC-8: Profile Management
- ✓ User can update full name and email
- ✓ User can upload profile photo (max 5MB)
- ✓ Photo preview shows before saving
- ✓ Profile photo persists after saving
- ✓ User can change password
- ✓ Current password is validated
- ✓ New password requirements enforced

### 11.2 Non-Functional Acceptance

#### AC-9: Performance
- ✓ Pages load within acceptable time (< 3 seconds)
- ✓ QR code renders immediately
- ✓ Search results appear within 500ms
- ✓ API responses complete within 2 seconds
- ✓ System handles 100 concurrent users

#### AC-10: Usability
- ✓ Interface is intuitive and easy to navigate
- ✓ Forms validate inputs with clear messages
- ✓ Actions provide immediate feedback
- ✓ Mobile responsive on all pages
- ✓ QR codes scannable from mobile devices
- ✓ Buttons and links clearly identifiable

#### AC-11: Security
- ✓ Passwords stored as hashed values only
- ✓ JWT tokens validated on protected routes
- ✓ Lecturers cannot access other lecturers' data
- ✓ Public endpoints limit student actions appropriately
- ✓ IP tracking prevents abuse
- ✓ Inputs sanitized to prevent injection

#### AC-12: Reliability
- ✓ No data corruption on errors
- ✓ Duplicate entries prevented by unique indexes
- ✓ System handles errors gracefully
- ✓ Database maintains consistency
- ✓ No attendance records lost

#### AC-13: Compatibility
- ✓ Works on Chrome, Firefox, Safari, Edge
- ✓ Functions on mobile devices (iOS/Android)
- ✓ Responsive on tablets and desktops
- ✓ QR scanning works on mobile cameras
- ✓ Supports 3G or better connection

---

## DOCUMENT APPROVAL

### Reviewers

| Name | Role | Date | Signature |
|------|------|------|-----------|
|      | Product Owner |  |  |
|      | Technical Lead |  |  |
|      | QA Manager |  |  |

### Change History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2025-12-31 | Development Team | Initial Release |

---

## APPENDICES

### Appendix A: Glossary

- **JWT (JSON Web Token):** Secure token format for authentication
- **QR Code:** Quick Response code for digital scanning
- **Matric Number:** Student identification number
- **Session:** A single class period for attendance
- **Manual Request:** Student-initiated attendance correction request
- **Lecturer:** Faculty member teaching courses (authenticated user)

### Appendix B: Acronyms

- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **URS:** User Requirements Specification
- **UI:** User Interface
- **FR:** Functional Requirement
- **NFR:** Non-Functional Requirement
- **SR:** Security Requirement

### Appendix C: References

- React Documentation: https://react.dev/
- Express.js Guide: https://expressjs.com/
- MongoDB Manual: https://www.mongodb.com/docs/
- JWT Standard: https://jwt.io/
- QR Code Specification: ISO/IEC 18004

---

**END OF DOCUMENT**
