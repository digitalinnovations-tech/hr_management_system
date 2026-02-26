import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    positionApplied: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'technical', 'hired', 'rejected'],
      default: 'applied',
    },
    resume: {
      url: String,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
    coverLetter: {
      url: String,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
    skills: [String],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    experience: [
      {
        company: String,
        position: String,
        description: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    interviews: [
      {
        interviewDate: Date,
        interviewType: {
          type: String,
          enum: ['phone', 'video', 'onsite', 'technical'],
        },
        interviewers: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        }],
        feedback: String,
        status: {
          type: String,
          enum: ['scheduled', 'completed', 'cancelled'],
          default: 'scheduled',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        notes: String,
      },
    ],
    salaryExpectation: {
      type: Number,
    },
    source: {
      type: String,
    },
    notes: {
      type: String,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate; 