import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../DB/db.js';
import User from '../models/userModel.js';
import Employee from '../models/employeeModel.js';
import Attendance from '../models/attendanceModel.js';

// Load environment variables
dotenv.config();

// Sample user data
const userData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    position: 'HR Manager',
    department: 'Human Resources',
    role: 'admin',
    status: 'active'
  },
  {
    name: 'Jane Copper',
    email: 'jane.copper@example.com',
    password: 'password123',
    position: 'Designer',
    department: 'Design',
    role: 'user',
    status: 'active'
  },
  {
    name: 'Arlene McCoy',
    email: 'arlene.mccoy@example.com',
    password: 'password123',
    position: 'Designer',
    department: 'Design',
    role: 'user',
    status: 'active'
  },
  {
    name: 'Cody Fisher',
    email: 'cody.fisher@example.com',
    password: 'password123',
    position: 'Senior Developer',
    department: 'Backend Development',
    role: 'user',
    status: 'active'
  },
  {
    name: 'Janney Wilson',
    email: 'janney.wilson@example.com',
    password: 'password123',
    position: 'Junior Developer',
    department: 'Backend Development',
    role: 'user',
    status: 'active'
  },
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    password: 'password123',
    position: 'Team Lead',
    department: 'Human Resource',
    role: 'hr',
    status: 'active'
  },
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: 'password123',
    position: 'Developer',
    department: 'Frontend Development',
    role: 'user',
    status: 'active'
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    password: 'password123',
    position: 'QA Engineer',
    department: 'Quality Assurance',
    role: 'user',
    status: 'active'
  },
];

// Sample attendance templates
const attendanceTemplates = [
  {
    status: 'present',
    notes: 'Working on dashboard redesign',
    workHours: 8
  },
  {
    status: 'absent',
    notes: 'Sick leave',
    workHours: 0
  },
  {
    status: 'present',
    notes: 'Team meeting, documentation work',
    workHours: 7.5
  },
  {
    status: 'present',
    notes: 'Backend API development',
    workHours: 8.5,
    overtime: 0.5
  },
  {
    status: 'halfDay',
    notes: 'Doctor appointment in afternoon',
    workHours: 4
  },
];

// Reset and seed function
const resetAndSeedData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database for reset and seeding');
    
    // Ask for confirmation (simulated in this script)
    console.log('WARNING: This will delete all existing data and create sample data!');
    console.log('Proceeding with reset and seed...');
    
    // Step 1: Delete all existing data
    console.log('Deleting existing data...');
    await Attendance.deleteMany({});
    await Employee.deleteMany({});
    await User.deleteMany({});
    console.log('All existing data deleted');
    
    // Step 2: Create users
    console.log('Creating users...');
    const createdUsers = [];
    let adminUserId = null;
    
    for (const user of userData) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
      
      if (user.role === 'admin') {
        adminUserId = createdUser._id;
      }
    }
    console.log(`Created ${createdUsers.length} users`);
    
    // Step 3: Create employees (except for admin)
    console.log('Creating employees...');
    const createdEmployees = [];
    
    // Skip the admin user (index 0)
    for (let i = 1; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const employee = await Employee.create({
        user: user._id,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        phone: `123-456-789${i}`,
        position: user.position,
        department: user.department,
        status: 'active',
        employeeId: `EMP00${i}`,
        joiningDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      });
      
      createdEmployees.push(employee);
    }
    console.log(`Created ${createdEmployees.length} employees`);
    
    // Step 4: Create attendance records
    console.log('Creating attendance records...');
    const attendanceRecords = [];
    
    // Create attendance for the last 7 days for each employee
    for (const employee of createdEmployees) {
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Only create attendance for weekdays (0 = Sunday, 6 = Saturday)
        if (date.getDay() === 0 || date.getDay() === 6) {
          continue;
        }
        
        // Select a random attendance template
        const template = attendanceTemplates[Math.floor(Math.random() * attendanceTemplates.length)];
        
        const attendanceRecord = await Attendance.create({
          employee: employee._id,
          date,
          status: template.status,
          notes: template.notes,
          workHours: template.workHours,
          overtime: template.overtime || 0,
          approvedBy: adminUserId
        });
        
        attendanceRecords.push(attendanceRecord);
      }
    }
    
    console.log(`Created ${attendanceRecords.length} attendance records`);
    console.log('Reset and seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during reset and seeding:', error);
    process.exit(1);
  }
};

// Run the reset and seed function
resetAndSeedData(); 