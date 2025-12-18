const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT || 'super-secure-jwt-secret-key-for-development-only';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        logger.warn('Authentication failed: No authorization token provided');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn(`Authentication failed: Invalid token - ${err.message}`);
            return res.status(403).json({ error: 'Invalid token' });
        }
        logger.auth(`User authenticated successfully: ${user.email || user.username || user.id}`);
        req.user = user;
        next();
    });
}
module.exports = authenticateToken;