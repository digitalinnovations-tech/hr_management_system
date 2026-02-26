import Leave from '../models/leaveModel.js';
import Employee from '../models/employeeModel.js';

// @desc    Get all leave requests with filters

const getLeaves = async (req, res) => {
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
    
    // Filter by leave type
    if (req.query.leaveType) {
      filterOptions.leaveType = req.query.leaveType;
    }
    
    // Filter by status
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    // Filter by not show
    if (req.query.notShow) {
      filterOptions.notShow = req.query.notShow === 'true' ? true : false;
    }
    
    // Filter by date range
    if (req.query.startDate) {
      filterOptions.startDate = { $gte: new Date(req.query.startDate) };
    }
    
    if (req.query.endDate) {
      filterOptions.endDate = { $lte: new Date(req.query.endDate) };
    }

    // Sort options
    const sortOptions = {};
    if (req.query.sortBy && req.query.sortOrder) {
      sortOptions[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by startDate in descending order
      sortOptions.startDate = -1;
    }

    // Get leave requests with pagination, filtering, and sorting
    const leaves = await Leave.find(filterOptions)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department status',
        match: { status: 'present' } // Only include present employees
      })
      .populate({
        path: 'approvedBy',
        select: 'name',
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Filter out leaves where employee is not present
    const filteredLeaves = leaves.filter(leave => leave.employee !== null);

    // Get total count for pagination
    const totalLeaves = await Leave.countDocuments(filterOptions);

    res.json({
      success: true,
      leaves: filteredLeaves,
      page,
      pages: Math.ceil(totalLeaves / limit),
      totalLeaves,
    });
  } catch (error) {
    console.error('Get leaves error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get leave by ID

const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
      })
      .populate({
        path: 'approvedBy',
        select: 'name',
      });

    if (leave) {
      res.json({
        success: true,
        leave,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }
  } catch (error) {
    console.error('Get leave by id error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get leaves for a specific employee

const getEmployeeLeaves = async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    // Get date range if provided
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    
    // Build filter options
    const filterOptions = { employee: employeeId };
    
    if (req.query.status) {
      filterOptions.status = req.query.status;
    }
    
    if (req.query.leaveType) {
      filterOptions.leaveType = req.query.leaveType;
    }
    
    if (startDate) {
      filterOptions.startDate = { $gte: startDate };
    }
    
    if (endDate) {
      filterOptions.endDate = { $lte: endDate };
    }
    
    const leaves = await Leave.find(filterOptions)
      .populate({
        path: 'approvedBy',
        select: 'name',
      })
      .sort({ startDate: -1 });
    
    res.json({
      success: true,
      leaves,
      count: leaves.length,
    });
  } catch (error) {
    console.error('Get employee leaves error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create a new leave request

const createLeave = async (req, res) => {
  try {
    const {
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      attachments,
      notShow
    } = req.body;

    // Check if employee exists and is active
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if employee is active
    if (employee.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active employees can apply for leaves',
      });
    }

    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Create new leave request
    const leave = new Leave({
      employee: employee._id,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      status: 'pending',
      notShow: notShow || false,
      attachments: attachments || [],
    });

    const savedLeave = await leave.save();

    if (savedLeave) {
      res.status(201).json({
        success: true,
        leave: savedLeave,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid leave data',
      });
    }
  } catch (error) {
    console.error('Create leave error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update a leave request

const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }

    // Update basic information
    if (req.body.leaveType) {
      leave.leaveType = req.body.leaveType;
    }
    
    if (req.body.reason) {
      leave.reason = req.body.reason;
    }
    
    if (req.body.notShow !== undefined) {
      leave.notShow = req.body.notShow;
    }

    if (req.body.status) {
      leave.status = req.body.status;
      
      // If the status is updated to approved or rejected, set the approver and approval date
      if (req.body.status === 'approved' || req.body.status === 'rejected') {
        leave.approvedBy = req.user._id;
        leave.approvedAt = new Date();
      }
    }
    
    if (req.body.comments) {
      leave.comments = req.body.comments;
    }
    
    if (req.body.startDate && req.body.endDate) {
      leave.startDate = new Date(req.body.startDate);
      leave.endDate = new Date(req.body.endDate);
      
      // Recalculate total days
      const diffTime = Math.abs(leave.endDate - leave.startDate);
      leave.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else if (req.body.startDate) {
      leave.startDate = new Date(req.body.startDate);
      
      // Recalculate total days
      const diffTime = Math.abs(leave.endDate - leave.startDate);
      leave.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else if (req.body.endDate) {
      leave.endDate = new Date(req.body.endDate);
      
      // Recalculate total days
      const diffTime = Math.abs(leave.endDate - leave.startDate);
      leave.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    
    if (req.body.attachments) {
      leave.attachments = req.body.attachments;
    }

    const updatedLeave = await leave.save();

    res.json({
      success: true,
      leave: updatedLeave,
    });
  } catch (error) {
    console.error('Update leave error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete a leave request

const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }

    // Only allow delete if the leave is in 'pending' status
    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a leave that has been approved or rejected',
      });
    }

    await Leave.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Leave request removed',
    });
  } catch (error) {
    console.error('Delete leave error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Approve or reject a leave request

const updateLeaveStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    
    // Check if user is HR
    if (req.user.role !== 'hr' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only HR can update leave status',
      });
    }
    
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be either approved or rejected',
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }

    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();
    
    if (comments) {
      leave.comments = comments;
    }

    const updatedLeave = await leave.save();

    res.json({
      success: true,
      leave: updatedLeave,
    });
  } catch (error) {
    console.error('Update leave status error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get approved leaves for calendar
const getApprovedLeaves = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filterOptions = {
      status: 'approved'
    };
    
    if (startDate) {
      filterOptions.startDate = { $gte: new Date(startDate) };
    }
    
    if (endDate) {
      filterOptions.endDate = { $lte: new Date(endDate) };
    }
    
    const leaves = await Leave.find(filterOptions)
      .populate({
        path: 'employee',
        select: 'firstName lastName employeeId department',
        match: { status: 'present' }
      })
      .populate({
        path: 'approvedBy',
        select: 'name',
      })
      .sort({ startDate: 1 });
    
    // Filter out leaves where employee is not present
    const filteredLeaves = leaves.filter(leave => leave.employee !== null);
    
    res.json({
      success: true,
      leaves: filteredLeaves,
    });
  } catch (error) {
    console.error('Get approved leaves error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Download leave document
const downloadDocument = async (req, res) => {
  try {
    const { leaveId, documentId } = req.params;
    
    const leave = await Leave.findById(leaveId);
    
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }
    
    const document = leave.attachments.find(doc => doc._id.toString() === documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }
    
    // Set appropriate headers for file download
    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${document.name}"`);
    
    // Send the file
    res.send(document.url);
  } catch (error) {
    console.error('Download document error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

export {
  getLeaves,
  getLeaveById,
  getEmployeeLeaves,
  createLeave,
  updateLeave,
  deleteLeave,
  updateLeaveStatus,
  getApprovedLeaves,
  downloadDocument,
}; 