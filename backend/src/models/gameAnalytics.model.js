import mongoose from 'mongoose';

const gameAnalyticsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // flexible object for game-specific data
    default: {},
  },
  playedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('GameAnalytics', gameAnalyticsSchema);
