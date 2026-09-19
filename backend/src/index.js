// ⚠️ dotenv MUST be loaded before any other imports in ESM.
// Use a dedicated loader file to ensure env is available at module evaluation time.
import './env.js';

import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db.config.js';
import authRoutes from './routes/auth.routes.js';
import gameAnalyticsRoutes from './routes/gameAnalytics.routes.js';
import rosterRoutes from './routes/roster.routes.js';
import routineRoutes from './routes/routine.routes.js';
import alertRoutes from './routes/alert.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import geminiRoutes from './routes/gemini.routes.js';
import messageRoutes from './routes/message.routes.js';
import memoryRoutes from './routes/memory.routes.js';
import userRoutes from './routes/user.routes.js';
import { initializeSocket } from './socket.js';

const app = express();
const server = http.createServer(app);

initializeSocket(server);
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', gameAnalyticsRoutes);
app.use('/api/roster', rosterRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/user', userRoutes);

// Global error handler
app.use(function (err, _req, res, _next) {
  console.error('Global Error Handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});
