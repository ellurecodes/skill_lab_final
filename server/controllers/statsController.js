const Task = require('../models/Task');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');

// @desc    Get aggregated dashboard metrics for current user
// @route   GET /api/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Task aggregations
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ user: userId, status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ user: userId, status: 'In Progress' });
    const highPriorityTasks = await Task.countDocuments({
      user: userId,
      priority: 'High',
      status: { $ne: 'Completed' },
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Placement drive aggregations
    const totalDrives = await PlacementDrive.countDocuments();
    const upcomingDrives = await PlacementDrive.countDocuments({ status: 'Upcoming' });
    
    // Average CTC calculation
    const drivesData = await PlacementDrive.find({}, 'ctc');
    const avgCtc =
      drivesData.length > 0
        ? (drivesData.reduce((acc, curr) => acc + (curr.ctc || 0), 0) / drivesData.length).toFixed(1)
        : 0;

    // Student application aggregations
    const myApplications = await Application.find({ student: userId }).populate('drive');
    const totalApplied = myApplications.length;
    const shortlistedCount = myApplications.filter((a) =>
      ['Shortlisted', 'OA Cleared', 'Interview Scheduled', 'Offered'].includes(a.status)
    ).length;
    const interviewsCount = myApplications.filter(
      (a) => a.status === 'Interview Scheduled'
    ).length;
    const offersCount = myApplications.filter((a) => a.status === 'Offered').length;

    // Category breakdown
    const categoryStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Urgent upcoming tasks (due within next 7 days and pending)
    const urgentTasks = await Task.find({
      user: userId,
      status: { $ne: 'Completed' },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    // Latest upcoming placement drives
    const featuredDrives = await PlacementDrive.find({ status: { $ne: 'Completed' } })
      .sort({ driveDate: 1 })
      .limit(4);

    // Admin / Coordinator specific metrics
    let admin = null;
    if (req.user && (req.user.role === 'admin' || req.user.role === 'coordinator')) {
      const User = require('../models/User');
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalAppsReceived = await Application.countDocuments();
      const totalOffersReleased = await Application.countDocuments({ status: 'Offered' });
      const totalInterviewsScheduled = await Application.countDocuments({ status: 'Interview Scheduled' });
      const totalShortlisted = await Application.countDocuments({
        status: { $in: ['Shortlisted', 'OA Cleared', 'Interview Scheduled', 'Offered'] }
      });

      const recentAdminApplications = await Application.find()
        .populate('student', 'name usn branch cgpa phone')
        .populate('drive', 'companyName role ctc')
        .sort({ appliedAt: -1 })
        .limit(8);

      admin = {
        totalStudents,
        totalAppsReceived,
        totalOffersReleased,
        totalInterviewsScheduled,
        totalShortlisted,
        recentApplications: recentAdminApplications,
      };
    }

    res.status(200).json({
      success: true,
      stats: {
        academic: {
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          highPriorityTasks,
          completionRate,
          categoryBreakdown: categoryStats,
        },
        placement: {
          totalDrives,
          upcomingDrives,
          avgCtc,
          totalApplied,
          shortlistedCount,
          interviewsCount,
          offersCount,
        },
        admin,
        urgentTasks,
        featuredDrives,
      },
    });
  } catch (error) {
    next(error);
  }
};
