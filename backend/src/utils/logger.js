const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const logDirectory = path.join(__dirname, '../logs');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFilePath = path.join(logDirectory, 'app.log');

class Logger {
  static log(level, message) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}\n`;

    // Append log to file
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err.message);
      }
    });

    // Log to console
    if (level === 'error') {
      console.error(logMessage.trim());
    } else {
      console.log(logMessage.trim());
    }
  }

  static info(message) {
    Logger.log('info', message);
  }

  static error(message) {
    Logger.log('error', message);
  }

  static warn(message) {
    Logger.log('warn', message);
  }
}

module.exports = Logger;