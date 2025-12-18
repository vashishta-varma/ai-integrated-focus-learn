// Client-side logger using pino-browser
import pino from 'pino';

// Browser logger configuration
const loggerConfig = {
  level: import.meta.env.VITE_LOG_LEVEL || 'info',
  browser: {
    asObject: true,
    serialize: true,
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

// Development logger with clean output
const developmentLogger = pino({
  level: import.meta.env.VITE_LOG_LEVEL || 'info',
  browser: {
    write: {
      info(o) { console.log(o.msg); },
      warn(o) { console.warn(o.msg); },
      error(o) { console.error(o.msg); },
      debug(o) { console.log(o.msg); },
    }
  }
});

// Production logger
const productionLogger = pino(loggerConfig);

// Export appropriate logger based on environment
const logger = import.meta.env.MODE === 'production' 
  ? productionLogger 
  : developmentLogger;

// Add custom methods for common client operations  
logger.auth = (message) => {
  logger.info(`🔐 AUTH: ${message}`);
};

logger.ui = (message) => {
  logger.info(`🎨 UI: ${message}`);
};

logger.api = (message) => {
  logger.info(`🌐 API: ${message}`);
};

logger.navigation = (message) => {
  logger.info(`🧭 NAV: ${message}`);
};

logger.performance = (message) => {
  logger.info(`⚡ PERF: ${message}`);
};

// Error boundary helper
logger.errorBoundary = (error, errorInfo) => {
  logger.error(`❌ REACT ERROR: ${error.message} in ${errorInfo.componentStack}`);
};

export default logger;