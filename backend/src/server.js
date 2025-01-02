const http = require('http');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./config/database.config').default;
const { connectToRedis } = require('./config/redis.config');
const Logger = require('./utils/logger');
const app = require('./app');

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Establish database connection
    await connectToDatabase();
    Logger.info('Connected to PostgreSQL database successfully.');

    // Establish Redis connection
    await connectToRedis();
    Logger.info('Connected to Redis successfully.');

    // Create and start HTTP server
    const server = http.createServer(app);
    server.listen(PORT, () => {
      Logger.info(`Server is running on http://localhost:${PORT}`);
    });

    // Graceful Shutdown
    process.on('SIGTERM', () => {
      Logger.info('SIGTERM signal received: closing server.');
      server.close(() => {
        Logger.info('HTTP server closed.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      Logger.info('SIGINT signal received: closing server.');
      server.close(() => {
        Logger.info('HTTP server closed.');
        process.exit(0);
      });
    });
  } catch (error) {
    Logger.error(`Error starting server: ${error.message}`);
    process.exit(1); // Exit with failure
  }
}

startServer();