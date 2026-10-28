const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    usn: {
      type: String,
      required: [true, 'Please provide USN'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$/, 'Please enter a valid USN format (e.g., 1RV23CS001)'],
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'coordinator'],
      default: 'student',
    },
    branch: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      default: 3,
    },
    cgpa: {
      type: Number,
      min: 0.0,
      max: 10.0,
      default: 8.5,
    },
    skills: {
      type: [String],
      default: ['JavaScript', 'HTML5', 'CSS3', 'React', 'Node.js', 'Express', 'MongoDB'],
    },
    phone: {
      type: String,
      trim: true,
      default: '+91 9380421476',
    },
    college: {
      type: String,
      default: 'RV College of Engineering (RVCE), Bengaluru',
    },
    github: {
      type: String,
      default: 'https://github.com/ellurecodes',
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com/in/vishal-ellure',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: 'Undergraduate student passionate about full-stack web development and scalable distributed systems.',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
