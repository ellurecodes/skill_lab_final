const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'edupulse_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, usn, branch, semester, cgpa, phone, skills, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { usn }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'USN already registered',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      usn,
      branch: branch || 'Computer Science & Engineering',
      semester: semester || 3,
      cgpa: cgpa || 8.5,
      phone: phone || '+91 9380421476',
      skills: skills || ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      role: role && ['student', 'admin', 'coordinator'].includes(role) ? role : 'student',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
        cgpa: user.cgpa,
        skills: user.skills,
        phone: user.phone,
        college: user.college,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
      },
      message: 'Student account registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login student or admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found with this email.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password did not match.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
        cgpa: user.cgpa,
        skills: user.skills,
        phone: user.phone,
        college: user.college,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
      },
      message: 'Authentication successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      branch: req.body.branch,
      semester: req.body.semester,
      cgpa: req.body.cgpa,
      skills: req.body.skills,
      bio: req.body.bio,
      github: req.body.github,
      linkedin: req.body.linkedin,
    };

    // Filter undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fast demo login for quick evaluation and viva
// @route   POST /api/auth/demo-login
// @access  Public
exports.demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body; // 'student' or 'admin'
    const targetEmail = role === 'admin' ? 'placement@rvce.edu.in' : 'vishal797577@gmail.com';

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      // Return first user or create one
      user = await User.findOne();
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No demo accounts found. Please run the seed command: npm run seed',
        });
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usn: user.usn,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
        cgpa: user.cgpa,
        skills: user.skills,
        phone: user.phone,
        college: user.college,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
      },
      message: `Signed in as Demo ${user.role.toUpperCase()}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin manually creates a new student account
// @route   POST /api/auth/admin/students
// @access  Private (Admin / Coordinator)
exports.adminCreateStudent = async (req, res, next) => {
  try {
    const { name, email, password, usn, branch, semester, cgpa, phone, skills, bio } = req.body;

    if (!name || !email || !usn) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student name, email, and USN',
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { usn }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'USN already registered',
      });
    }

    const student = await User.create({
      name,
      email,
      password: password || 'student123',
      usn: usn.toUpperCase(),
      branch: branch || 'Computer Science & Engineering',
      semester: semester || 3,
      cgpa: cgpa || 8.0,
      phone: phone || '+91 9380421476',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['JavaScript', 'HTML5', 'CSS3', 'React']),
      bio: bio || 'Undergraduate student at RV College of Engineering.',
      role: 'student',
    });

    res.status(201).json({
      success: true,
      student,
      message: `Student account for ${student.name} (${student.usn}) created successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin gets all registered students
// @route   GET /api/auth/admin/students
// @access  Private (Admin / Coordinator)
exports.adminGetStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ usn: 1 });
    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};
