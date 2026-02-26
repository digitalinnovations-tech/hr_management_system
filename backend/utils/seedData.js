import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../DB/db.js';
import Employee from '../models/employeeModel.js';
import Attendance from '../models/attendanceModel.js';
import User from '../models/userModel.js';

// Load environment variables
dotenv.config();

// Sample attendance data
const attendanceData = [
  {
    date: new Date(),
    status: 'present',
    notes: 'Working on dashboard redesign',
    workHours: 8
  },
  {
    date: new Date(),
    status: 'absent',
    notes: 'Sick leave',
    workHours: 0
  },
  {
    date: new Date(),
    status: 'present',
    notes: 'Team meeting, documentation work',
    workHours: 7.5
  },
  {
    date: new Date(),
    status: 'present',
    notes: 'Backend API development',
    workHours: 8.5,
    overtime: 0.5
  },
  {
    date: new Date(),
    status: 'halfDay',
    notes: 'Doctor appointment in afternoon',
    workHours: 4
  },
];

// Seed function
const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database for seeding');
    
    // Check if there are existing employees
    const employeeCount = await Employee.countDocuments();
    if (employeeCount === 0) {
      console.log('No employees found. Please create employees first.');
      process.exit(1);
    }
    
    // Get all active employees
    const employees = await Employee.find({ status: 'active' });
    console.log(`Found ${employees.length} active employees`);
    
    // Check if there's attendance data already
    const attendanceCount = await Attendance.countDocuments();
    if (attendanceCount > 0) {
      console.log(`Database already has ${attendanceCount} attendance records. Skipping seeding.`);
      process.exit(0);
    }
    
    // Get admin user for approvedBy field
    const admin = await User.findOne({ role: 'admin' });
    
    // Create attendance records for each employee
    const attendanceRecords = [];
    for (const employee of employees) {
      // Select a random attendance template for each employee
      const template = attendanceData[Math.floor(Math.random() * attendanceData.length)];
      
      attendanceRecords.push({
        employee: employee._id,
        date: template.date,
        status: template.status,
        notes: template.notes,
        workHours: template.workHours,
        overtime: template.overtime || 0,
        approvedBy: admin ? admin._id : null
      });
    }
    
    // Insert attendance records
    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);
    
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 