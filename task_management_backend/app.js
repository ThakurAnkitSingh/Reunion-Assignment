const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const knex = require('knex');
const knexfile = require('./knexfile');
const db = knex(knexfile.development);
dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://frontend-reunion-task.onrender.com',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await db.migrate.latest();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Error during database migration:', error);
  }
});
