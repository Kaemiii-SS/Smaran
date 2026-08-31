import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.config.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log(`Server running on port ${PORT}`);
});