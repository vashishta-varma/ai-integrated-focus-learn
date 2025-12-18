const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Request ID generator middleware
const requestId = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Request/Response logging middleware
const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log incoming request with descriptive message
  logger.api(`Incoming ${req.method} request to ${req.url} from ${req.ip}`);

  // Capture original end function
  const originalEnd = res.end;
  
  // Override res.end to log response
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    const statusText = res.statusCode >= 400 ? 'FAILED' : 'SUCCESS';
    
    logger.api(`${statusText}: ${req.method} ${req.url} responded with ${res.statusCode} in ${duration}ms`);
    
    // Call original end function
    originalEnd.call(res, chunk, encoding);
  };

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error(`ERROR: ${req.method} ${req.url} failed - ${err.message}`);
  
  next(err);
};

module.exports = {
  requestId,
  httpLogger,
  errorLogger,
};