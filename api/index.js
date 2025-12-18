// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const { requestId, httpLogger, errorLogger } = require('./middleware/logging');
const userRoutes = require('./routes/users');
const journeyRoutes = require('./routes/journey');
const chapterRoutes = require('./routes/chapterRoutes');
const noteRoutes = require('./routes/noteRoutes');
const chatbotRoutes = require('./routes/chatbot');
const db = require('./dbConnec');

dotenv.config();
const port = process.env.PORT||5000;
const app = express();

// Logging middleware
app.use(requestId);
app.use(httpLogger);

app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
  }));

// routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', journeyRoutes);
app.use('/api/v1/journeys', chapterRoutes);
app.use('/api/v1', noteRoutes);
app.use('/api/v1/chatbot', chatbotRoutes); 

app.get('/', (req,res)=>{
    res.send("<h1> This api is working </h1>")
})

// Error logging middleware
app.use(errorLogger);

// Initialize database and start server
const startServer = async () => {
    try {
        await db.init();
        logger.database('SQLite database initialized and connected successfully');
        
        app.listen(port, () => {
            logger.info(`🚀 Focus Learn API server running on http://localhost:${port}`);
        });
    } catch (error) {
        logger.error(`❌ Application startup failed: ${error.message}`);
        process.exit(1);
    }
};

startServer();