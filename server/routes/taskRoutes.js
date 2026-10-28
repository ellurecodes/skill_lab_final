const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  bulkSyncTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // All task routes require authentication

router.route('/')
  .get(getTasks)
  .post(createTask);

router.post('/bulk-sync', bulkSyncTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', toggleTaskStatus);

module.exports = router;
