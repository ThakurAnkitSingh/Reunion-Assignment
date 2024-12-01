const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskControllers');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.use(authMiddleware);

// Task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.post('/:id', taskController.updateTask);
router.delete('/delete', taskController.deleteTask);
router.get('/dashboard/statistics', taskController.getStatistics);

module.exports = router;