// routes/chatbot.js

const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../utils/logger');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        logger.chatbot(`New chat request received: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`); 

        if (!message) {
            logger.warn('Chat request rejected: Empty message provided');
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            logger.error('Chat request failed: Gemini API key not configured in environment');
            return res.status(500).json({ error: 'Gemini API key is not configured' });
        }

        // Get the generative model - using Gemini Pro (stable)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Create a simple helpful assistant prompt
        const contextualPrompt = `You are a helpful AI assistant. Answer the user's question accurately and concisely. Be friendly, informative, and provide useful information on any topic they ask about.

User question: "${message}"

Please provide a helpful response:`;

        logger.chatbot('Sending request to Gemini AI...');

        // Generate content
        const result = await model.generateContent(contextualPrompt);
        const response = await result.response;
        const text = response.text();

        logger.chatbot(`Gemini AI responded successfully with ${text.length} characters`);

        res.json({ 
            response: text,
            success: true 
        });

    } catch (error) {
        logger.error(`Gemini AI request failed: ${error.message}${error.status ? ` (Status: ${error.status})` : ''}`);
        
        // Handle specific Gemini API errors
        if (error.message.includes('API_KEY') || error.status === 401) {
            return res.status(401).json({ 
                error: 'Invalid API key configuration',
                success: false 
            });
        }
        
        if (error.message.includes('quota') || error.status === 429) {
            return res.status(429).json({ 
                error: 'API quota exceeded. Please try again later.',
                success: false 
            });
        }

        if (error.message.includes('SAFETY')) {
            return res.status(400).json({ 
                error: 'I can only help with educational and learning-related topics. How can I assist you with your studies?',
                success: false 
            });
        }

        // Provide a fallback educational response
        const fallbackResponses = [
            "I'm experiencing some technical difficulties, but I'm here to help answer any questions you have! Feel free to ask me about anything educational, technical, or related to learning.",
            "Sorry, I'm having connection issues right now. I can usually help with a wide range of topics including technology, programming, study tips, and more. Please try asking your question again!",
            "I'm having trouble connecting to my knowledge base right now. Normally I can answer questions about various topics including AI, programming, and educational subjects. What would you like to know?",
        ];

        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

        res.status(200).json({ 
            response: randomResponse,
            success: true,
            fallback: true
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        service: 'FocusLearn Chatbot',
        geminiConfigured: !!process.env.GEMINI_API_KEY
    });
});

module.exports = router;