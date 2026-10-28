const Task = require('../models/Task');

// @desc    Get all tasks for current user with filtering, searching, and sorting
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { status, category, priority, search, sortBy, sortOrder } = req.query;

    const query = { user: req.user.id };

    if (status && status !== 'All') {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    let sort = { dueDate: 1 };
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      sort = { [sortBy]: order };
    }

    const tasks = await Task.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, category, priority, status, dueDate, subject, notes } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and due date',
      });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      category: category || 'Lab Experiment',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      subject: subject || 'Full Stack Development',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      task,
      message: 'Task created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id ${req.params.id}`,
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or set task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
exports.toggleTaskStatus = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id ${req.params.id}`,
      });
    }

    const newStatus =
      req.body.status || (task.status === 'Completed' ? 'Pending' : 'Completed');

    task.status = newStatus;
    task.completedAt = newStatus === 'Completed' ? new Date() : null;
    await task.save();

    res.status(200).json({
      success: true,
      task,
      message: `Task marked as ${task.status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk synchronize tasks from browser LocalStorage to MongoDB
// @route   POST /api/tasks/bulk-sync
// @access  Private
exports.bulkSyncTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No tasks provided for synchronization',
      });
    }

    const syncedTasks = [];
    for (const item of tasks) {
      // Avoid duplicate by matching title and user
      const existing = await Task.findOne({
        user: req.user.id,
        title: item.title,
      });

      if (!existing) {
        const created = await Task.create({
          user: req.user.id,
          title: item.title,
          category: item.category || 'Lab Experiment',
          priority: item.priority || 'Medium',
          status: item.status || 'Pending',
          dueDate: item.dueDate || new Date(),
          subject: item.subject || 'Full Stack Development',
          notes: item.notes || '',
        });
        syncedTasks.push(created);
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully synchronized ${syncedTasks.length} tasks from LocalStorage to MongoDB`,
      syncedCount: syncedTasks.length,
      syncedTasks,
    });
  } catch (error) {
    next(error);
  }
};
