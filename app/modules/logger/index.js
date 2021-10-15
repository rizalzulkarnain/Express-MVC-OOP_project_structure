const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { format } = require('winston');
const { combine, timestamp, prettyPrint, errors } = format;

const fs = require('fs');
const util = require('util');
const path = require('path');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const transport = new DailyRotateFile({
  datePattern: 'YYYY-MM-DD',
  dirname: 'logs',
});

const logger = winston.createLogger({
  format: combine(
    errors({ stack: true }),
    timestamp(),
    prettyPrint(),
    format.json()
  ),
  json: true,
  transports: [transport],
});

logger.getLogDates = async () => {
  const destination = path.join(__dirname, '../../../logs');
  const files = await readdir(destination, { withFileTypes: true });

  return files
    .filter((file) => !file.isDirectory() && file.name !== '.gitignore')
    .map((file) => file.name.split('.')[2]);
};

logger.getLogByDates = async (date) => {
  const destination = path.join(__dirname, `../../../logs/winston.log.${date}`);
  const file = await readFile(destination, 'utf8');
  const logs = file.split('\n');
  const parsedLogs = [];
  const logLevels = {};

  for (const log of logs) {
    try {
      const parsedLogs = JSON.parse(log);

      if (logLevels.hasOwnProperty(parsedLogs.level)) {
        logLevels[parsedLogs.level]++;
      } else {
        logLevels[parsedLogs.level] = 1;
      }

      parsedLogs.push(parsedLogs);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    date,
    total: parsedLogs.length,
    logLevels,
    logs: parsedLogs,
  };
};

module.exports = logger;
