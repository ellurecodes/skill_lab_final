const express = require('express');
const router = express.Router();
const {
  getDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  applyForDrive,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getDriveApplications,
} = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/auth');

// Public endpoints to browse drives
router.get('/', getDrives);

// Admin: Get all applications across all drives
router.get('/admin/all-applications', protect, authorize('admin', 'coordinator'), getAllApplications);

// Student applications route (must be before :id to prevent matching 'my' as ID)
router.get('/my/applications', protect, getMyApplications);

router.get('/:id', getDriveById);

// Student action: apply for drive
router.post('/:id/apply', protect, applyForDrive);

// Admin/Coordinator drive management
router.post('/', protect, authorize('admin', 'coordinator'), createDrive);
router.put('/:id', protect, authorize('admin', 'coordinator'), updateDrive);
router.delete('/:id', protect, authorize('admin', 'coordinator'), deleteDrive);

// Admin/Coordinator application review
router.get('/:id/applications', protect, authorize('admin', 'coordinator'), getDriveApplications);
router.patch('/applications/:id/status', protect, authorize('admin', 'coordinator'), updateApplicationStatus);

module.exports = router;
