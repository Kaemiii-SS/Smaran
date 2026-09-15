import PatientCaregiver from '../models/patientCaregiver.model.js';
import User from '../models/user.model.js';
import Streak from '../models/streak.model.js';

export async function addPatientToRoster(req, res) {
  try {
    const { patientId } = req.body;
    const caregiverId = req.user._id;

    if (req.user.role !== 'Caretaker') {
      return res.status(403).json({ error: 'Only caretakers can add patients' });
    }

    // Verify patient exists and is a Patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'Patient') {
      return res.status(404).json({ error: 'Patient not found or invalid role' });
    }

    const mapping = await PatientCaregiver.create({
      caregiverId,
      patientId
    });

    res.status(201).json({ message: 'Patient added to roster', mapping });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Patient is already in your roster' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getCaregiverRoster(req, res) {
  try {
    const caregiverId = req.user._id;

    if (req.user.role !== 'Caretaker') {
      return res.status(403).json({ error: 'Only caretakers can view rosters' });
    }

    const mappings = await PatientCaregiver.find({ caregiverId, status: 'Active' })
      .populate('patientId', 'name username email');

    const roster = await Promise.all(mappings.map(async (mapping) => {
      const streak = await Streak.findOne({ patientId: mapping.patientId._id });
      return {
        _id: mapping._id,
        patient: mapping.patientId,
        streak: streak || { currentStreak: 0, longestStreak: 0, lastActiveDate: null }
      };
    }));

    res.status(200).json(roster);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getMyCaretaker(req, res) {
  try {
    const patientId = req.user._id;

    if (req.user.role !== 'Patient') {
      return res.status(403).json({ error: 'Only patients can fetch their caretaker' });
    }

    const mapping = await PatientCaregiver.findOne({ patientId, status: 'Active' })
      .populate('caregiverId', 'name username email role');

    if (!mapping) {
      return res.status(404).json({ error: 'No caretaker assigned' });
    }

    res.status(200).json(mapping.caregiverId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
