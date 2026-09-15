import User from '../models/user.model.js';
import PatientCaregiver from '../models/patientCaregiver.model.js';
import GameAnalytics from '../models/gameAnalytics.model.js';
import Streak from '../models/streak.model.js';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let additionalData = {};

        if (user.role === 'Caretaker') {
            const patientCount = await PatientCaregiver.countDocuments({ caregiverId: userId, status: 'Active' });
            additionalData = { patientCount };
        } else if (user.role === 'Patient') {
            const streak = await Streak.findOne({ patientId: userId });
            const analytics = await GameAnalytics.find({ patientId: userId });
            
            // Calculate average score
            let totalScore = 0;
            analytics.forEach(game => {
                totalScore += game.score || 0;
            });
            const averageScore = analytics.length > 0 ? Math.round(totalScore / analytics.length) : 0;

            additionalData = { 
                streak: streak ? streak.currentStreak : 0,
                gamesPlayed: analytics.length,
                averageScore
            };
        }

        res.status(200).json({ user, ...additionalData });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio, degree, speciality } = req.body;
        
        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (degree !== undefined) updateData.degree = degree;
        if (speciality !== undefined) updateData.speciality = speciality;
        
        if (req.file) {
            updateData.profilePicUrl = req.file.path;
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after' }).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: 'Server error' });
    }
};
