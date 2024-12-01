const knex = require('knex');
const db = require('./db');

// Create a new task
const createTask = async (userId, taskData) => {
  const { title, start_time, end_time, priority, status } = taskData;
  return await db('tasks').insert({
    user_id: userId,
    title,
    start_time,
    end_time,
    priority,
    status,
  });
};

// Get tasks for a user
const getTasksByUser = async (userId, filters = {}, sortBy = 'start_time ASC') => {
  let query = db('tasks').where({ user_id: userId });

  if (filters?.priority) query = query.andWhere('priority', filters?.priority);
  if (filters?.status) query = query.andWhere('status', filters?.status);

  const [sortField, sortDirection] = sortBy.split(' '); // Split sort criteria (e.g. 'start_time ASC')
  query = query.orderBy(sortField, sortDirection);

  return await query;
};


// Update a task
const updateTask = async (taskId, userId, taskData) => {
  return await db('tasks')
    .where({ id: taskId, user_id: userId })
    .update(taskData);
};

// Delete a task
const deleteTask = async (taskIds, userId) => {
  return await db('tasks')
    .whereIn('id', taskIds)
    .andWhere({ user_id: userId })
    .del();
};

const getPendingStats = async (userId) => {
  try {
    const query = `
      SELECT priority, 
             COUNT(*) AS pendingTasks, 
             SUM(TIMESTAMPDIFF(HOUR, start_time, NOW())) AS timeLapsed, 
             SUM(TIMESTAMPDIFF(HOUR, NOW(), end_time)) AS timeRemaining 
      FROM tasks 
      WHERE user_id = ? AND status = 'pending' 
      GROUP BY priority
    `;

    const priorityStats = await db.raw(query, [userId]);
    return priorityStats;
  } catch (error) {
    console.error('Error in get priority stats:', error.message);
    throw new Error('Failed to fetch priority stats. Please try again later.');
  }
};

const getPriorityStatsForAll = async (userId) => {
  try {
    const priorityStats = await db
      .select({
        priority: 'priorities.priority',
      })
      .count({ pendingTasks: 'tasks.id' })
      .sum({
        timeLapsed: db.raw('TIMESTAMPDIFF(HOUR, start_time, NOW())'),
        timeRemaining: db.raw(
          `GREATEST(TIMESTAMPDIFF(HOUR, NOW(), end_time), 0)`
        ),
      })
      .from(
        db.raw(
          `(SELECT 1 AS priority UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) AS priorities`
        )
      )
      .leftJoin('tasks', function () {
        this.on('tasks.priority', '=', 'priorities.priority')
          .andOn('tasks.user_id', '=', db.raw('?', [userId]))
          .andOn('tasks.status', '=', db.raw('?', ['pending']));
      })
      .groupBy('priorities.priority')
      .orderBy('priorities.priority');
    
    return priorityStats;
  } catch (error) {
    console.error('Error fetching priority stats for all priorities:', error);
    throw error;
  }
};



module.exports = { createTask, getTasksByUser, updateTask, deleteTask, getPendingStats, getPriorityStatsForAll };