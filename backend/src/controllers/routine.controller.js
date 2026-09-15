import Routine from '../models/routine.model.js';

export async function createRoutine(req, res) {
  try {
    const { patientId, taskName, timeOfDay, date } = req.body;
    
    // In a real app, only caretaker (or system) can assign routine to a patient.
    // Simplifying authorization for MVP.
    const routineDate = date ? new Date(date) : new Date();
    routineDate.setHours(0, 0, 0, 0);

    const routine = await Routine.create({
      patientId: patientId || req.user._id,
      taskName,
      timeOfDay,
      date: routineDate
    });

    res.status(201).json(routine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getDailyRoutines(req, res) {
  try {
    const { patientId } = req.params;
    let queryDate = req.query.date ? new Date(req.query.date) : new Date();
    queryDate.setHours(0, 0, 0, 0);

    const routines = await Routine.find({
      patientId,
      date: queryDate
    }).sort({ timeOfDay: 1 });

    res.status(200).json(routines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function markRoutineCompleted(req, res) {
  try {
    const { routineId } = req.params;
    
    const routine = await Routine.findByIdAndUpdate(
      routineId,
      { isCompleted: true },
      { returnDocument: 'after' }
    );

    if (!routine) return res.status(404).json({ error: 'Routine not found' });

    res.status(200).json(routine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateRoutine(req, res) {
  try {
    const { routineId } = req.params;
    const { taskName, timeOfDay } = req.body;
    
    const routine = await Routine.findByIdAndUpdate(
      routineId,
      { taskName, timeOfDay },
      { returnDocument: 'after' }
    );

    if (!routine) return res.status(404).json({ error: 'Routine not found' });
    res.status(200).json(routine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteRoutine(req, res) {
  try {
    const { routineId } = req.params;
    
    const routine = await Routine.findByIdAndDelete(routineId);
    if (!routine) return res.status(404).json({ error: 'Routine not found' });
    
    res.status(200).json({ message: 'Routine deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getUnfinishedRoutines(req, res) {
  try {
    const { patientId } = req.params;
    
    // Get start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get date 7 days ago
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const routines = await Routine.find({
      patientId,
      isCompleted: false,
      date: { $gte: sevenDaysAgo, $lt: today }
    }).sort({ date: -1, timeOfDay: -1 });

    res.status(200).json(routines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
