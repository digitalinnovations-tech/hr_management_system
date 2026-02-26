import Employee from '../models/employeeModel.js';
import User from '../models/userModel.js';

// @desc    Get all employees

const getEmployees = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter options
    const filterOptions = {};
    
    if (req.query.department) {
      filterOptions.department = req.query.department;
    }
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }

    // Search by name or employee ID
    if (req.query.search) {
      const search = req.query.search;
      filterOptions.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    const sortOptions = {};
    if (req.query.sortBy && req.query.sortOrder) {
      sortOptions[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by joiningDate in descending order
      sortOptions.joiningDate = -1;
    }

    // Get employees with pagination, filtering, and sorting
    const employees = await Employee.find(filterOptions)
      .populate('user', 'name email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalEmployees = await Employee.countDocuments(filterOptions);

    res.json({
      success: true,
      employees,
      page,
      pages: Math.ceil(totalEmployees / limit),
      totalEmployees,
    });
  } catch (error) {
    console.error('Get employees error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get employee by ID

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user', 'name email role profilePic');

    if (employee) {
      res.json({
        success: true,
        employee,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
  } catch (error) {
    console.error('Get employee by id error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create a new employee

const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      salary,
      address,
      employeeId,
      joiningDate,
      skills,
      education,
      experience,
    } = req.body;

    // Check if employee ID already exists
    const employeeExists = await Employee.findOne({ employeeId });
    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this ID already exists',
      });
    }

    // Check if email already exists
    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email already exists',
      });
    }

    // Create user account for the employee
    const user = new User({
      name: `${firstName} ${lastName}`,
      email,
      password: 'password123', // Set a default password - should be changed by the employee
      position,
      department,
      role: 'user',
    });

    const savedUser = await user.save();

    if (!savedUser) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user account',
      });
    }

    // Create new employee
    const employee = new Employee({
      user: savedUser._id,
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      position,
      department,
      salary,
      address,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      status: 'active',
      skills: skills || [],
      education: education || [],
      experience: experience || [],
    });

    const savedEmployee = await employee.save();

    if (savedEmployee) {
      res.status(201).json({
        success: true,
        employee: savedEmployee,
      });
    } else {
      // If employee creation failed, delete the created user
      await User.findByIdAndDelete(savedUser._id);
      
      res.status(400).json({
        success: false,
        message: 'Invalid employee data',
      });
    }
  } catch (error) {
    console.error('Create employee error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update an employee

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      // Update employee fields
      employee.firstName = req.body.firstName || employee.firstName;
      employee.lastName = req.body.lastName || employee.lastName;
      employee.email = req.body.email || employee.email;
      employee.phone = req.body.phone || employee.phone;
      employee.position = req.body.position || employee.position;
      employee.department = req.body.department || employee.department;
      employee.salary = req.body.salary || employee.salary;
      employee.status = req.body.status || employee.status;
      
      if (req.body.address) {
        employee.address = {
          ...employee.address,
          ...req.body.address,
        };
      }

      if (req.body.emergencyContact) {
        employee.emergencyContact = {
          ...employee.emergencyContact,
          ...req.body.emergencyContact,
        };
      }

      // Update user information if user field exists
      if (employee.user) {
        const user = await User.findById(employee.user);
        if (user) {
          user.name = `${req.body.firstName || employee.firstName} ${req.body.lastName || employee.lastName}`;
          user.email = req.body.email || employee.email;
          user.position = req.body.position || employee.position;
          user.department = req.body.department || employee.department;
          
          await user.save();
        }
      }

      const updatedEmployee = await employee.save();

      res.json({
        success: true,
        employee: updatedEmployee,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
  } catch (error) {
    console.error('Update employee error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete an employee

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      // Delete the user account associated with the employee
      if (employee.user) {
        await User.findByIdAndDelete(employee.user);
      }

      // Delete the employee
      await Employee.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Employee removed',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
  } catch (error) {
    console.error('Delete employee error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

export { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee }; 