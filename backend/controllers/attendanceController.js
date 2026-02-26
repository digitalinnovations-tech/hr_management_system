import Attendance from '../models/attendanceModel.js';
import Employee from '../models/employeeModel.js';

// @desc    Get all attendance records with filters

const getAttendanceRecords = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter options
    const filterOptions = {};
    
    // Filter by employee
    if (req.query.employeeId) {
      const employee = await Employee.findOne({ employeeId: req.query.employeeId });
      if (employee) {
        filterOptions.employee = employee._id;
      } else {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
      }
    }
    
    // Filter by status
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      filterOptions.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      filterOptions.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filterOptions.date = { $lte: new Date(req.query.endDate) };
    } else if (req.query.date) {
      const date = new Date(req.query.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      filterOptions.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Sort options
    const sortOptions = {};
    if (req.query.sortBy && req.query.sortOrder) {
      sortOptions[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by date in descending order
      sortOptions.date = -1;
    }

    // Get attendance records with pagination, filtering, and sorting
    const attendanceRecords = await Attendance.find(filterOptions)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
      })
      .populate({
        path: 'approvedBy',
        select: 'name',
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalRecords = await Attendance.countDocuments(filterOptions);

    res.json({
      success: true,
      attendanceRecords,
      page,
      pages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (error) {
    console.error('Get attendance records error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get attendance records for a specific employee
// @route   GET /api/attendance/employee/:id
// @access  Private
const getEmployeeAttendance = async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    // Get date range if provided
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    
    // Build filter options
    const filterOptions = { employee: employeeId };
    
    if (startDate && endDate) {
      filterOptions.date = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (startDate) {
      filterOptions.date = { $gte: startDate };
    } else if (endDate) {
      filterOptions.date = { $lte: endDate };
    }
    
    const attendance = await Attendance.find(filterOptions)
      .populate({
        path: 'approvedBy',
        select: 'name',
      })
      .sort({ date: -1 });
    
    if (attendance) {
      res.json({
        success: true,
        attendance,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No attendance records found',
      });
    }
  } catch (error) {
    console.error('Get employee attendance error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get attendance for a specific date
// @route   GET /api/attendance/date/:date
// @access  Private
const getAttendanceByDate = async (req, res) => {
  try {
    const dateParam = req.params.date;
    const date = new Date(dateParam);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      });
    }
    
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const attendance = await Attendance.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate({
      path: 'employee',
      select: 'firstName lastName employeeId department',
    });
    
    res.json({
      success: true,
      date: dateParam,
      attendance,
      count: attendance.length,
    });
  } catch (error) {
    console.error('Get attendance by date error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create a new attendance record
// @route   POST /api/attendance
// @access  Private
const createAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      date,
      checkIn,
      checkOut,
      status,
      workHours,
      overtime,
      notes,
    } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Convert date string to Date object
    const attendanceDate = new Date(date);
    
    // Check if attendance record already exists for this employee on this date
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lte: new Date(attendanceDate.setHours(23, 59, 59, 999)),
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance record already exists for this employee on this date',
      });
    }

    // Calculate work hours if check-in and check-out are provided but workHours is not
    let calculatedWorkHours = workHours;
    if (checkIn && checkOut && !workHours) {
      const checkInTime = new Date(checkIn.time);
      const checkOutTime = new Date(checkOut.time);
      calculatedWorkHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert milliseconds to hours
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      employee: employeeId,
      date: attendanceDate,
      checkIn,
      checkOut,
      status,
      workHours: calculatedWorkHours || 0,
      overtime: overtime || 0,
      notes,
      approvedBy: req.user._id,
    });

    if (attendance) {
      res.status(201).json({
        success: true,
        attendance,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid attendance data',
      });
    }
  } catch (error) {
    console.error('Create attendance error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update an attendance record
// @route   PUT /api/attendance/:id
// @access  Private
const updateAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    // Update fields
    if (req.body.date) {
      attendance.date = new Date(req.body.date);
    }
    
    if (req.body.checkIn) {
      attendance.checkIn = req.body.checkIn;
    }
    
    if (req.body.checkOut) {
      attendance.checkOut = req.body.checkOut;
    }
    
    if (req.body.status) {
      attendance.status = req.body.status;
    }
    
    if (req.body.workHours !== undefined) {
      attendance.workHours = req.body.workHours;
    } else if (req.body.checkIn && req.body.checkOut) {
      // Recalculate work hours if check-in and check-out are updated
      const checkInTime = new Date(req.body.checkIn.time);
      const checkOutTime = new Date(req.body.checkOut.time);
      attendance.workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    }
    
    if (req.body.overtime !== undefined) {
      attendance.overtime = req.body.overtime;
    }
    
    if (req.body.notes) {
      attendance.notes = req.body.notes;
    }
    
    // Mark as approved by the current user
    attendance.approvedBy = req.user._id;

    const updatedAttendance = await attendance.save();

    res.json({
      success: true,
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error('Update attendance error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Attendance record removed',
    });
  } catch (error) {
    console.error('Delete attendance error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

export {
  getAttendanceRecords,
  getEmployeeAttendance,
  getAttendanceByDate,
  createAttendance,
  updateAttendance,
  deleteAttendance,
}; 