import Candidate from '../models/candidateModel.js';
import Employee from '../models/employeeModel.js';
import User from '../models/userModel.js';
import { generateEmployeeId } from '../utils/helpers.js';

// @desc    Get all candidates

const getCandidates = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter options
    const filterOptions = {};
    
    // Basic filters
    if (req.query.department) {
      if (Array.isArray(req.query.department)) {
        filterOptions.department = { $in: req.query.department };
      } else {
        filterOptions.department = req.query.department;
      }
    }
    
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        filterOptions.status = { $in: req.query.status };
      } else {
        filterOptions.status = req.query.status;
      }
    }

    if (req.query.positionApplied) {
      if (Array.isArray(req.query.positionApplied)) {
        filterOptions.positionApplied = { $in: req.query.positionApplied };
      } else {
        filterOptions.positionApplied = req.query.positionApplied;
      }
    }

    // Skill filter
    if (req.query.skills) {
      const skillsArray = Array.isArray(req.query.skills) 
        ? req.query.skills 
        : req.query.skills.split(',');
      filterOptions.skills = { $all: skillsArray };
    }
    
    // Source filter
    if (req.query.source) {
      if (Array.isArray(req.query.source)) {
        filterOptions.source = { $in: req.query.source };
      } else {
        filterOptions.source = req.query.source;
      }
    }
    
    // Salary expectation range
    if (req.query.minSalary || req.query.maxSalary) {
      filterOptions.salaryExpectation = {};
      
      if (req.query.minSalary) {
        filterOptions.salaryExpectation.$gte = parseInt(req.query.minSalary);
      }
      
      if (req.query.maxSalary) {
        filterOptions.salaryExpectation.$lte = parseInt(req.query.maxSalary);
      }
    }

    // Global search (search in multiple fields)
    if (req.query.search) {
      const search = req.query.search;
      filterOptions.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { positionApplied: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    // Date range filter for application date
    if (req.query.startDate && req.query.endDate) {
      filterOptions.applicationDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      filterOptions.applicationDate = {
        $gte: new Date(req.query.startDate),
      };
    } else if (req.query.endDate) {
      filterOptions.applicationDate = {
        $lte: new Date(req.query.endDate),
      };
    }

    // Filter by interview status
    if (req.query.interviewStatus) {
      filterOptions['interviews.status'] = req.query.interviewStatus;
    }

    // Sort options
    const sortOptions = {};
    if (req.query.sortBy && req.query.sortOrder) {
      sortOptions[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by applicationDate in descending order
      sortOptions.applicationDate = -1;
    }

    // Get candidates with pagination, filtering, and sorting
    const candidates = await Candidate.find(filterOptions)
      .populate('referredBy', 'firstName lastName')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCandidates = await Candidate.countDocuments(filterOptions);

    // Get available filter options for UI dropdowns
    const departments = await Candidate.distinct('department');
    const positions = await Candidate.distinct('positionApplied');
    const statuses = await Candidate.distinct('status');
    const sources = await Candidate.distinct('source');

    res.json({
      success: true,
      candidates,
      page,
      pages: Math.ceil(totalCandidates / limit),
      totalCandidates,
      filterOptions: {
        departments,
        positions,
        statuses,
        sources,
      },
    });
  } catch (error) {
    console.error('Get candidates error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get candidate by ID

const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('referredBy', 'firstName lastName email');

    if (candidate) {
      res.json({
        success: true,
        candidate,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }
  } catch (error) {
    console.error('Get candidate by id error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create a new candidate

const createCandidate = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      positionApplied,
      department,
      status,
      resume,
      coverLetter,
      skills,
      education,
      experience,
      salaryExpectation,
      source,
      notes,
      referredById,
    } = req.body;

    // Check if candidate already exists
    const candidateExists = await Candidate.findOne({ email });
    if (candidateExists) {
      return res.status(400).json({
        success: false,
        message: 'Candidate with this email already exists',
      });
    }

    // Check if referred by a valid employee
    let referredBy = null;
    if (referredById) {
      const employee = await Employee.findById(referredById);
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Referenced employee not found',
        });
      }
      referredBy = referredById;
    }

    // Create new candidate
    const candidate = new Candidate({
      firstName,
      lastName,
      email,
      phone,
      address,
      positionApplied,
      department,
      status: status || 'applied',
      resume,
      coverLetter,
      skills: skills || [],
      education: education || [],
      experience: experience || [],
      salaryExpectation,
      source,
      notes,
      referredBy,
      applicationDate: new Date(),
    });

    const savedCandidate = await candidate.save();

    if (savedCandidate) {
      res.status(201).json({
        success: true,
        candidate: savedCandidate,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid candidate data',
      });
    }
  } catch (error) {
    console.error('Create candidate error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update a candidate

const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      // Update basic information
      candidate.firstName = req.body.firstName || candidate.firstName;
      candidate.lastName = req.body.lastName || candidate.lastName;
      candidate.email = req.body.email || candidate.email;
      candidate.phone = req.body.phone || candidate.phone;
      candidate.positionApplied = req.body.positionApplied || candidate.positionApplied;
      candidate.department = req.body.department || candidate.department;
      candidate.status = req.body.status || candidate.status;
      candidate.salaryExpectation = req.body.salaryExpectation || candidate.salaryExpectation;
      candidate.source = req.body.source || candidate.source;
      candidate.notes = req.body.notes || candidate.notes;
      
      // Update address if provided
      if (req.body.address) {
        candidate.address = {
          ...candidate.address,
          ...req.body.address,
        };
      }

      // Update skills if provided
      if (req.body.skills) {
        candidate.skills = req.body.skills;
      }

      // Update resume and cover letter if provided
      if (req.body.resume) {
        candidate.resume = req.body.resume;
      }

      if (req.body.coverLetter) {
        candidate.coverLetter = req.body.coverLetter;
      }

      // Update education if provided
      if (req.body.education) {
        candidate.education = req.body.education;
      }

      // Update experience if provided
      if (req.body.experience) {
        candidate.experience = req.body.experience;
      }

      // Update interviews if provided
      if (req.body.interviews) {
        candidate.interviews = req.body.interviews;
      }

      // Update referredBy if provided
      if (req.body.referredById) {
        // Check if employee exists
        const employee = await Employee.findById(req.body.referredById);
        if (employee) {
          candidate.referredBy = req.body.referredById;
        }
      }

      const updatedCandidate = await candidate.save();

      res.json({
        success: true,
        candidate: updatedCandidate,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }
  } catch (error) {
    console.error('Update candidate error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete a candidate

const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      await Candidate.findByIdAndDelete(req.params.id);
      
      res.json({
        success: true,
        message: 'Candidate removed',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }
  } catch (error) {
    console.error('Delete candidate error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Add an interview to a candidate

const addCandidateInterview = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (candidate) {
      const {
        interviewDate,
        interviewType,
        interviewers,
        notes,
      } = req.body;

      const newInterview = {
        interviewDate,
        interviewType,
        interviewers,
        status: 'scheduled',
        notes,
      };

      candidate.interviews.push(newInterview);
      
      // Update candidate status to 'interview'
      if (candidate.status === 'applied' || candidate.status === 'screening') {
        candidate.status = 'interview';
      }

      const updatedCandidate = await candidate.save();

      res.status(201).json({
        success: true,
        interview: updatedCandidate.interviews[updatedCandidate.interviews.length - 1],
        candidate: updatedCandidate,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }
  } catch (error) {
    console.error('Add interview error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Download candidate resume as PDF

const downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    if (!candidate.resume || !candidate.resume.url) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for this candidate',
      });
    }

    // Return the resume URL for the client to download
    res.json({
      success: true,
      resumeUrl: candidate.resume.url,
      fileName: `${candidate.firstName}_${candidate.lastName}_Resume.pdf`,
    });

  } catch (error) {
    console.error('Resume download error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Convert candidate to employee

const convertToEmployee = async (req, res) => {
  try {
    const { 
      salary, 
      joiningDate, 
      position,
      department, 
      password 
    } = req.body;

    // Validate required fields
    if (!salary || !joiningDate || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide salary, joining date, and password',
      });
    }

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found',
      });
    }

    // Check if email already exists in User model
    const userExists = await User.findOne({ email: candidate.email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user account
    const user = await User.create({
      name: `${candidate.firstName} ${candidate.lastName}`,
      email: candidate.email,
      password,
      position: position || candidate.positionApplied,
      department: department || candidate.department,
      role: 'user',
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user account',
      });
    }

    // Generate employee ID
    const employeeId = await generateEmployeeId();

    // Create employee record
    const employee = await Employee.create({
      user: user._id,
      employeeId,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      position: position || candidate.positionApplied,
      department: department || candidate.department,
      joiningDate: new Date(joiningDate),
      salary,
      status: 'active',
      address: candidate.address,
      skills: candidate.skills,
      education: candidate.education,
      experience: candidate.experience,
      documents: candidate.resume ? [
        {
          name: 'Resume',
          url: candidate.resume.url,
          uploadDate: candidate.resume.uploadDate,
        }
      ] : [],
    });

    if (!employee) {
      // Rollback user creation if employee creation fails
      await User.findByIdAndDelete(user._id);
      
      return res.status(400).json({
        success: false,
        message: 'Failed to create employee record',
      });
    }

    // Update candidate status to 'hired'
    candidate.status = 'hired';
    await candidate.save();

    res.status(201).json({
      success: true,
      message: 'Candidate successfully converted to employee',
      employee,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        position: user.position,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Convert to employee error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

export {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  addCandidateInterview,
  downloadResume,
  convertToEmployee,
}; 