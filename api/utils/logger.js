const pino = require('pino');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Base logger configuration
const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
};

// Development logger with pretty printing
const developmentLogger = pino({
  ...loggerConfig,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname,requestId,component,method,url,statusCode,duration,contentLength,userId,email,username,messageLength,hasContext,responseLength,errorStatus',
      translateTime: 'SYS:standard',
      singleLine: true,
      messageFormat: '{msg}',
    },
  },
});

// Production logger with file output
const productionLogger = pino(
  loggerConfig,
  pino.multistream([
    // Console output
    { 
      level: 'info', 
      stream: process.stdout 
    },
    // Error file
    {
      level: 'error',
      stream: pino.destination({
        dest: path.join(logsDir, 'error.log'),
        sync: false,
        mkdir: true,
      }),
    },
    // Combined file
    {
      level: 'debug',
      stream: pino.destination({
        dest: path.join(logsDir, 'combined.log'),
        sync: false,
        mkdir: true,
      }),
    },
  ])
);

// Export appropriate logger based on environment
const logger = process.env.NODE_ENV === 'production' 
  ? productionLogger 
  : developmentLogger;

// Add custom methods for common operations
logger.database = (message, data = {}) => {
  logger.info({ component: 'database', ...data }, message);
};

logger.auth = (message, data = {}) => {
  logger.info({ component: 'auth', ...data }, message);
};

logger.api = (message, data = {}) => {
  logger.info({ component: 'api', ...data }, message);
};

logger.chatbot = (message, data = {}) => {
  logger.info({ component: 'chatbot', ...data }, message);
};

// Create module-specific logger function for backward compatibility
const createModuleLogger = (moduleName) => {
  return {
    info: (message, data = {}) => logger.info({ component: moduleName, ...data }, message),
    warn: (message, data = {}) => logger.warn({ component: moduleName, ...data }, message),
    error: (message, data = {}) => logger.error({ component: moduleName, ...data }, message),
    debug: (message, data = {}) => logger.debug({ component: moduleName, ...data }, message),
  };
};

module.exports = logger;
module.exports.createModuleLogger = createModuleLogger;