const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Please provide job role'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    ctc: {
      type: Number,
      required: [true, 'Please specify CTC in LPA'],
      min: [0, 'CTC cannot be negative'],
    },
    minCgpa: {
      type: Number,
      required: [true, 'Please specify minimum CGPA criteria'],
      min: 0.0,
      max: 10.0,
      default: 7.0,
    },
    eligibleBranches: {
      type: [String],
      required: [true, 'Please specify eligible branches'],
      default: ['CSE', 'ISE', 'ECE', 'AI&ML'],
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Internship', 'FTE + Internship'],
      default: 'Full Time',
    },
    location: {
      type: String,
      trim: true,
      default: 'Bengaluru / Hybrid',
    },
    driveDate: {
      type: Date,
      required: [true, 'Please specify the drive date'],
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify application deadline'],
    },
    selectionRounds: {
      type: [String],
      default: ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'HR / Managerial Round'],
    },
    description: {
      type: String,
      required: [true, 'Please provide company/role description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

placementDriveSchema.index({ status: 1, driveDate: 1, ctc: -1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
