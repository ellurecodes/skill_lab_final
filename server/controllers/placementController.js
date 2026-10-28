const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get all placement drives with filter, search, sort
// @route   GET /api/placements
// @access  Public (Enriched if authenticated)
exports.getDrives = async (req, res, next) => {
  try {
    const { status, jobType, minCtc, search, eligibleOnly } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }
    if (minCtc) {
      query.ctc = { $gte: Number(minCtc) };
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // If user is authenticated and asks for eligibleOnly
    if (eligibleOnly === 'true' && req.user) {
      query.minCgpa = { $lte: req.user.cgpa };
    }

    const drives = await PlacementDrive.find(query).sort({ driveDate: 1, ctc: -1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      drives,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single drive by ID
// @route   GET /api/placements/:id
// @access  Public
exports.getDriveById = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: `Placement drive not found with id ${req.params.id}`,
      });
    }

    // Check if authenticated user has already applied
    let userApplication = null;
    if (req.user) {
      userApplication = await Application.findOne({
        student: req.user._id,
        drive: drive._id,
      });
    }

    res.status(200).json({
      success: true,
      drive,
      userApplication,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new placement drive
// @route   POST /api/placements
// @access  Private (Admin / Coordinator)
exports.createDrive = async (req, res, next) => {
  try {
    const {
      companyName,
      role,
      ctc,
      minCgpa,
      eligibleBranches,
      jobType,
      location,
      driveDate,
      deadline,
      selectionRounds,
      description,
      status,
    } = req.body;

    const drive = await PlacementDrive.create({
      companyName,
      role,
      ctc,
      minCgpa: minCgpa !== undefined ? minCgpa : 7.0,
      eligibleBranches: eligibleBranches || ['CSE', 'ISE', 'ECE'],
      jobType: jobType || 'Full Time',
      location: location || 'Bengaluru',
      driveDate,
      deadline,
      selectionRounds: selectionRounds || ['OA', 'Technical', 'HR'],
      description,
      status: status || 'Upcoming',
      createdBy: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      drive,
      message: 'Placement drive created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update placement drive
// @route   PUT /api/placements/:id
// @access  Private (Admin / Coordinator)
exports.updateDrive = async (req, res, next) => {
  try {
    let drive = await PlacementDrive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: `Drive not found with id ${req.params.id}`,
      });
    }

    drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      drive,
      message: 'Placement drive updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete placement drive
// @route   DELETE /api/placements/:id
// @access  Private (Admin / Coordinator)
exports.deleteDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: `Drive not found with id ${req.params.id}`,
      });
    }

    await drive.deleteOne();
    await Application.deleteMany({ drive: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Placement drive and associated applications deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Student applies for a placement drive
// @route   POST /api/placements/:id/apply
// @access  Private (Student)
exports.applyForDrive = async (req, res, next) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Placement drive not found',
      });
    }

    // Check deadline
    if (new Date() > new Date(drive.deadline)) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline for this drive has passed',
      });
    }

    // Check CGPA Eligibility
    if (req.user.cgpa < drive.minCgpa) {
      return res.status(400).json({
        success: false,
        message: `Eligibility criteria not met: Minimum required CGPA is ${drive.minCgpa}, your current CGPA is ${req.user.cgpa}`,
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      student: req.user.id,
      drive: drive._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this placement drive',
      });
    }

    const application = await Application.create({
      student: req.user.id,
      drive: drive._id,
      status: 'Applied',
      currentRound: drive.selectionRounds[0] || 'Application Screening',
      notes: req.body.notes || 'Applied via EduPulse student portal',
    });

    const populatedApp = await Application.findById(application._id)
      .populate('drive')
      .populate('student', 'name email usn branch cgpa');

    res.status(201).json({
      success: true,
      application: populatedApp,
      message: `Successfully applied to ${drive.companyName} for ${drive.role}!`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's submitted applications
// @route   GET /api/placements/my/applications
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('drive')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across all drives (Admin / Coordinator)
// @route   GET /api/placements/admin/all-applications
// @access  Private (Admin / Coordinator)
exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email usn branch cgpa phone')
      .populate('drive', 'companyName role ctc')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Admin/Coordinator)
// @route   PATCH /api/placements/applications/:id/status
// @access  Private (Admin / Coordinator)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, currentRound, interviewDate, notes } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (status) application.status = status;
    if (currentRound) application.currentRound = currentRound;
    if (interviewDate) application.interviewDate = interviewDate;
    if (notes) application.notes = notes;

    await application.save();

    res.status(200).json({
      success: true,
      application,
      message: `Application status updated to ${application.status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a drive (Admin / Coordinator)
// @route   GET /api/placements/:id/applications
// @access  Private (Admin / Coordinator)
exports.getDriveApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ drive: req.params.id })
      .populate('student', 'name email usn branch cgpa phone')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};
