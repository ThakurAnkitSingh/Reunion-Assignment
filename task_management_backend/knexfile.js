require('dotenv').config(); // Load environment variables

module.exports = {
  development: {
    client: 'mysql2', // Ensure this matches your database client
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    },
    migrations: {
      directory: './migrations', // Ensure this path is correct
    },
  },
  // Add other environments (production, testing) as needed
};

