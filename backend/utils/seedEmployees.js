import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../DB/db.js';
import Employee from '../models/employeeModel.js';

// Load environment variables
dotenv.config();

// Sample employee data
const employeeData = [
  {
    firstName: 'Jane',
    lastName: 'Copper',
    email: 'jane.copper@example.com',
    phone: '123-456-7890',
    position: 'Designer',
    department: 'Design',
    status: 'active',
    employeeId: 'EMP001',
    joiningDate: new Date('2022-01-15'),
    workType: 'Full Time'
  },
  {
    firstName: 'Arlene',
    lastName: 'McCoy',
    email: 'arlene.mccoy@example.com',
    phone: '123-456-7891',
    position: 'Designer',
    department: 'Design',
    status: 'active',
    employeeId: 'EMP002',
    joiningDate: new Date('2021-08-10'),
    workType: 'Full Time'
  },
  {
    firstName: 'Cody',
    lastName: 'Fisher',
    email: 'cody.fisher@example.com',
    phone: '123-456-7892',
    position: 'Senior Developer',
    department: 'Backend Development',
    status: 'active',
    employeeId: 'EMP003',
    joiningDate: new Date('2020-05-22'),
    workType: 'Full Time'
  },
  {
    firstName: 'Janney',
    lastName: 'Wilson',
    email: 'janney.wilson@example.com',
    phone: '123-456-7893',
    position: 'Junior Developer',
    department: 'Backend Development',
    status: 'active',
    employeeId: 'EMP004',
    joiningDate: new Date('2022-11-03'),
    workType: 'Full Time'
  },
  {
    firstName: 'Leslie',
    lastName: 'Alexander',
    email: 'leslie.alexander@example.com',
    phone: '123-456-7894',
    position: 'Team Lead',
    department: 'Human Resource',
    status: 'active',
    employeeId: 'EMP005',
    joiningDate: new Date('2019-12-01'),
    workType: 'Full Time'
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '123-456-7895',
    position: 'Developer',
    department: 'Frontend Development',
    status: 'active',
    employeeId: 'EMP006',
    joiningDate: new Date('2021-10-15'),
    workType: 'Full Time'
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    phone: '123-456-7896',
    position: 'QA Engineer',
    department: 'Quality Assurance',
    status: 'active',
    employeeId: 'EMP007',
    joiningDate: new Date('2022-03-28'),
    workType: 'Full Time'
  },
];

// Seed function
const seedEmployees = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database for seeding');
    
    // Check if there are existing employees
    const employeeCount = await Employee.countDocuments();
    if (employeeCount > 0) {
      console.log(`Database already has ${employeeCount} employees. Skipping seeding.`);
      process.exit(0);
    }
    
    // Insert employees
    const employees = await Employee.insertMany(employeeData);
    console.log(`Created ${employees.length} employees`);
    
    console.log('Employee seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during employee seeding:', error);
    process.exit(1);
  }
};

// Run the seed function
seedEmployees(); 