# HR System Backend API

This is the backend API for the HR System Dashboard application. It provides endpoints for managing employees, candidates, attendance, and leave requests.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt for password hashing

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hr-system
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=30d
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Employees

- `GET /api/employees` - Get all employees (protected)
- `POST /api/employees` - Create a new employee (admin only)
- `GET /api/employees/:id` - Get employee by ID (protected)
- `PUT /api/employees/:id` - Update an employee (admin only)
- `DELETE /api/employees/:id` - Delete an employee (admin only)

### Candidates

- `GET /api/candidates` - Get all candidates (protected)
- `POST /api/candidates` - Create a new candidate (protected)
- `GET /api/candidates/:id` - Get candidate by ID (protected)
- `PUT /api/candidates/:id` - Update a candidate (protected)
- `DELETE /api/candidates/:id` - Delete a candidate (protected)
- `POST /api/candidates/:id/interviews` - Add an interview to a candidate (protected)

### Attendance

- `GET /api/attendance` - Get all attendance records (protected)
- `POST /api/attendance` - Create a new attendance record (protected)
- `PUT /api/attendance/:id` - Update an attendance record (protected)
- `DELETE /api/attendance/:id` - Delete an attendance record (admin only)
- `GET /api/attendance/employee/:id` - Get attendance records for a specific employee (protected)
- `GET /api/attendance/date/:date` - Get attendance records for a specific date (protected)

### Leave Requests

- `GET /api/leaves` - Get all leave requests (protected)
- `POST /api/leaves` - Create a new leave request (protected)
- `GET /api/leaves/:id` - Get leave request by ID (protected)
- `PUT /api/leaves/:id` - Update a leave request (protected)
- `DELETE /api/leaves/:id` - Delete a leave request (protected)
- `GET /api/leaves/employee/:id` - Get leave requests for a specific employee (protected)
- `PUT /api/leaves/:id/status` - Approve or reject a leave request (admin only)

## Data Models

### User

- name: String (required)
- email: String (unique, required)
- password: String (required)
- position: String
- department: String
- role: String (enum: 'user', 'hr', 'admin')
- profilePic: String
- phoneNumber: String
- address: String
- joiningDate: Date
- status: String (enum: 'active', 'inactive', 'onLeave')

### Employee

- user: ObjectId (ref: 'User')
- employeeId: String (unique, required)
- firstName: String (required)
- lastName: String (required)
- email: String (unique, required)
- phone: String
- position: String (required)
- department: String (required)
- joiningDate: Date
- salary: Number
- status: String (enum: 'active', 'inactive', 'onLeave')
- address: Object
- emergencyContact: Object
- documents: Array
- skills: Array
- education: Array
- experience: Array
- performanceReviews: Array

### Candidate

- firstName: String (required)
- lastName: String (required)
- email: String (unique, required)
- phone: String
- address: Object
- positionApplied: String (required)
- department: String (required)
- applicationDate: Date
- status: String (enum: 'applied', 'screening', 'interview', 'technical', 'hired', 'rejected')
- resume: Object
- coverLetter: Object
- skills: Array
- education: Array
- experience: Array
- interviews: Array
- salaryExpectation: Number
- source: String
- notes: String
- referredBy: ObjectId (ref: 'Employee')

### Attendance

- employee: ObjectId (ref: 'Employee')
- date: Date (required)
- checkIn: Object
- checkOut: Object
- status: String (enum: 'present', 'absent', 'halfDay', 'late', 'weekOff', 'holiday')
- workHours: Number
- overtime: Number
- notes: String
- approvedBy: ObjectId (ref: 'User')

### Leave

- employee: ObjectId (ref: 'Employee')
- leaveType: String (enum: 'casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid', 'other')
- startDate: Date (required)
- endDate: Date (required)
- totalDays: Number (required)
- reason: String (required)
- status: String (enum: 'pending', 'approved', 'rejected', 'cancelled')
- approvedBy: ObjectId (ref: 'User')
- approvedAt: Date
- comments: String
- attachments: Array

## License

This project is licensed under the MIT License. 