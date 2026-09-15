import GameAnalytics from '../models/gameAnalytics.model.js';
import Streak from '../models/streak.model.js';
import { saveScoreSchema } from '../validators/gameAnalytics.validator.js';
import mongoose from 'mongoose';

// Save a new game score and update streaks
export async function saveScore(req, res) {
  try {
    const parsedData = saveScoreSchema.parse(req.body);
    const patientId = req.user._id;

    // Create the game analytics record
    const newAnalytics = await GameAnalytics.create({
      patientId,
      gameId: parsedData.gameId,
      score: parsedData.score,
      duration: parsedData.duration || 0,
      details: parsedData.details || {},
      playedAt: new Date()
    });

    // Handle streaks
    let streak = await Streak.findOne({ patientId });
    
    if (!streak) {
      streak = new Streak({
        patientId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: new Date()
      });
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
      if (lastActive) {
        lastActive.setHours(0, 0, 0, 0);
      }

      if (!lastActive) {
        streak.currentStreak = 1;
        if (streak.longestStreak < 1) streak.longestStreak = 1;
        streak.lastActiveDate = new Date();
      } else {
        const diffTime = Math.abs(today - lastActive);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          // Played yesterday, increment streak
          streak.currentStreak += 1;
          if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
          }
          streak.lastActiveDate = new Date();
        } else if (diffDays > 1) {
          // Missed a day or more, reset streak
          streak.currentStreak = 1;
          streak.lastActiveDate = new Date();
        }
        // If diffDays === 0, they already played today, do nothing to streak
      }
    }

    await streak.save();

    res.status(201).json({
      message: 'Score saved successfully',
      analytics: newAnalytics,
      streak
    });
  } catch (error) {
    if (error.errors) return res.status(400).json({ errors: error.errors });
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Get game analytics and streak for a patient
export async function getPatientAnalytics(req, res) {
  try {
    const { patientId } = req.params;
    
    // Simple authorization check: Caretakers can see, or the patient themselves
    // Since we don't have caretakers mapped yet, we just ensure auth middleware passes.
    
    const scores = await GameAnalytics.find({ patientId }).sort({ playedAt: -1 });
    const streak = await Streak.findOne({ patientId });

    res.status(200).json({
      scores,
      streak: streak || { currentStreak: 0, longestStreak: 0, lastActiveDate: null }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Get aggregated progress analytics for a patient (Caretaker view)
export async function getProgressAnalytics(req, res) {
  try {
    const { patientId } = req.params;
    
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    // Aggregate stats by gameId
    const progress = await GameAnalytics.aggregate([
      { 
        $match: { 
          patientId: new mongoose.Types.ObjectId(patientId),
          playedAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: "$gameId",
          totalGamesPlayed: { $sum: 1 },
          averageScore: { $avg: "$score" },
          averageDuration: { $avg: "$duration" },
          highestScore: { $max: "$score" },
          recentScores: { $push: { score: "$score", playedAt: "$playedAt", details: "$details" } }
        }
      },
      {
        $project: {
          gameId: "$_id",
          totalGamesPlayed: 1,
          averageScore: { $round: ["$averageScore", 1] },
          averageDuration: { $round: ["$averageDuration", 1] },
          highestScore: 1,
          recentScores: { $slice: ["$recentScores", -5] }, // only keep the 5 most recent scores per game
          _id: 0
        }
      }
    ]);
    
    res.status(200).json({ progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
