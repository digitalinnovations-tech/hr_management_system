import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../DB/db.js';
import User from '../models/userModel.js';
import Employee from '../models/employeeModel.js';
import Attendance from '../models/attendanceModel.js';

// Load environment variables
dotenv.config();

const checkDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');
    
    // Check users
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Check employees
    const employees = await Employee.find({}).populate('user');
    console.log(`\nFound ${employees.length} employees:`);
    if (employees.length > 0) {
      employees.forEach(employee => {
        console.log(`- ${employee.firstName} ${employee.lastName} (${employee.employeeId}) - User: ${employee.user ? employee.user.name : 'No user linked'}`);
      });
    }
    
    // Check attendance
    const attendance = await Attendance.find({}).populate('employee');
    console.log(`\nFound ${attendance.length} attendance records:`);
    if (attendance.length > 0) {
      // Only show the first 5 records to avoid overwhelming output
      attendance.slice(0, 5).forEach(record => {
        console.log(`- Date: ${record.date.toDateString()}, Status: ${record.status}, Employee: ${record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : 'Unknown'}`);
      });
      if (attendance.length > 5) {
        console.log(`... and ${attendance.length - 5} more records`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
};

// Run the check
checkDatabase(); 