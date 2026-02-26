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

// Sample attendance data
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

// Seed function
const seedAll = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database for seeding');
    
    // Step 1: Create users
    console.log('Creating users...');
    let adminUserId = null;
    const createdUsers = [];
    
    // Check if users already exist
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`Database already has ${userCount} users. Getting existing users...`);
      const existingUsers = await User.find({});
      existingUsers.forEach(user => {
        createdUsers.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          position: user.position,
          department: user.department
        });
        
        if (user.role === 'admin') {
          adminUserId = user._id;
        }
      });
    } else {
      // Create new users
      for (const user of userData) {
        const createdUser = await User.create(user);
        createdUsers.push(createdUser);
        
        if (user.role === 'admin') {
          adminUserId = createdUser._id;
        }
      }
      console.log(`Created ${createdUsers.length} users`);
    }
    
    // Step 2: Create employees using the user IDs
    console.log('Creating employees...');
    const employeeCount = await Employee.countDocuments();
    
    if (employeeCount > 0) {
      console.log(`Database already has ${employeeCount} employees. Skipping employee creation.`);
    } else {
      // Skip the admin user (index 0)
      for (let i = 1; i < createdUsers.length; i++) {
        const user = createdUsers[i];
        await Employee.create({
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
      }
      console.log(`Created ${createdUsers.length - 1} employees`);
    }
    
    // Step 3: Create attendance records
    console.log('Creating attendance records...');
    const attendanceCount = await Attendance.countDocuments();
    
    if (attendanceCount > 0) {
      console.log(`Database already has ${attendanceCount} attendance records. Skipping attendance creation.`);
    } else {
      // Get all employees
      const employees = await Employee.find({});
      console.log(`Found ${employees.length} employees for attendance records`);
      
      let attendanceRecords = [];
      
      // Create attendance for the last 7 days for each employee
      for (const employee of employees) {
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          // Only create attendance for weekdays (0 = Sunday, 6 = Saturday)
          if (date.getDay() === 0 || date.getDay() === 6) {
            continue;
          }
          
          // Select a random attendance template
          const template = attendanceTemplates[Math.floor(Math.random() * attendanceTemplates.length)];
          
          attendanceRecords.push({
            employee: employee._id,
            date,
            status: template.status,
            notes: template.notes,
            workHours: template.workHours,
            overtime: template.overtime || 0,
            approvedBy: adminUserId
          });
        }
      }
      
      // Insert attendance records
      await Attendance.insertMany(attendanceRecords);
      console.log(`Created ${attendanceRecords.length} attendance records`);
    }
    
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAll(); 