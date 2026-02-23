import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, errors } = winston.format;

const LOGS_DIRECTORY = 'storage/logs/';

const levelBasedFormat = winston.format((info) => {
  const timestamp = info?.timestamp || new Date().toISOString();
  const base = `[${timestamp}] ${info.level.toUpperCase()}: ${info.message}`;

  if (info.level === 'error') {
    const jsonDetails = JSON.stringify(info, null, 2);
    info[Symbol.for('message')] = `${base}\n${jsonDetails}`;
  } else info[Symbol.for('message')] = base;

  return info;
});

const transports = [
  new DailyRotateFile({
    filename: `${LOGS_DIRECTORY}%DATE%-app-logs.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
  }),
  new winston.transports.Console({
    level: 'debug',
  }),
];

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), errors({ stack: true }), levelBasedFormat()),
  transports,
});

export default logger;
