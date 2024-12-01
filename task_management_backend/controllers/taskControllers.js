const taskModel = require('../models/taskModel');

// Create a task
const createTask = async (req, res) => {
  const userId = req.user.id; // Retrieved from middleware
  const taskData = req.body;

  try {
    const task = await taskModel.createTask(userId, taskData);
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

// Get tasks
const getTasks = async (req, res) => {
  const userId = req.user.id;
  const { priority, status, sortBy } = req.query;

  try {
    const tasks = await taskModel.getTasksByUser(userId, { priority, status }, sortBy);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const taskData = req.body;

  try {
    await taskModel.updateTask(taskId, userId, taskData);
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const userId = req.user.id;
  const taskIds = req.body.ids;

  try {
    await taskModel.deleteTask(taskIds, userId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

// Get dashboard statistics
const getStatistics = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch aggregated stats
    const getAllTaskStats = await taskModel.getTasksByUser(userId);
    const completedTasks = getAllTaskStats?.filter(task => task?.status === 'finished')?.length;
    const pendingTasks = getAllTaskStats?.filter(task => task?.status === 'pending')?.length;

    const averageCompletionTime =
      getAllTaskStats?.filter(task => task?.status === 'finished')
        .reduce((acc, task) => acc + (new Date(task?.end_time) - new Date(task?.start_time)) / (1000 * 60 * 60), 0) /
      (completedTasks || 1);

    const pendingStats = await taskModel.getPendingStats(userId);
    const priorityStats = await taskModel.getPriorityStatsForAll(userId);
    res.status(200).json({
      totalTasks: getAllTaskStats?.length,
      completedTasks,
      pendingTasks,
      averageCompletionTime: parseFloat(averageCompletionTime.toFixed(2)) || 0,
      pendingTaskSummary: {
        totalLapsedTime: pendingStats[0][0]?.timeLapsed,
        totalRemainingTime: pendingStats[0][0]?.timeRemaining > 0 ? pendingStats[0][0]?.timeRemaining : 0,
      },
      priorityStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, getStatistics };