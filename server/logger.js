const winston = require('winston');
const moment = require('moment-timezone');

require('winston-daily-rotate-file');
require('date-utils');

const LOGGER = winston.createLogger({
  level: 'info',
  // 로그파일저장
  transports: [
    new winston.transports.DailyRotateFile({
      filename: '../logs/system.log',
      zippedArchive: false,
      format: winston.format.printf(
        info =>
          `${moment(new Date())
            .tz('Asia/Seoul')
            .format('YYYY-MM-DD HH:mm:ss')} [${info.level.toUpperCase()}] - ${
            info.message
          }`,
      ),
    }),
    new winston.transports.Console({
      format: winston.format.printf(
        info =>
          `${moment(new Date())
            .tz('Asia/Seoul')
            .format('YYYY-MM-DD HH:mm:ss')} [${info.level.toUpperCase()}] - ${
            info.message
          }`,
      ),
    }),
  ],
});

module.exports = LOGGER;
