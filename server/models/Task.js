const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide task title'],
      trim: true,
      maxlength: [140, 'Title cannot exceed 140 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Lab Experiment', 'Assignment', 'Exam Prep', 'Project Work', 'Personal'],
      default: 'Lab Experiment',
    },
    priority: {
      type: String,
      required: [true, 'Please specify priority'],
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date'],
    },
    subject: {
      type: String,
      trim: true,
      default: 'Full Stack Development',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto set completedAt timestamp when marked completed
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'Completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'Completed') {
      this.completedAt = null;
    }
  }
  next();
});

// Index for high performance queries
taskSchema.index({ user: 1, status: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
