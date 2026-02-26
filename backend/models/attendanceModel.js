import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      time: Date,
      ip: String,
      location: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
    },
    checkOut: {
      time: Date,
      ip: String,
      location: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'halfDay', 'late', 'weekOff', 'holiday'],
      default: 'present',
    },
    workHours: {
      type: Number,
      default: 0,
    },
    overtime: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique attendance entries per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance; 