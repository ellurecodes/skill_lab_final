const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'OA Cleared', 'Interview Scheduled', 'Offered', 'Rejected'],
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    interviewDate: {
      type: Date,
    },
    currentRound: {
      type: String,
      default: 'Application Submitted',
    },
    resumeLink: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application for the same drive by the same student
applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
