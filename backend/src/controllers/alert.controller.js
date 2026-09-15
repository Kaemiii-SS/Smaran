import Alert from '../models/alert.model.js';
import PatientCaregiver from '../models/patientCaregiver.model.js';

export async function createAlert(req, res) {
  try {
    const { patientId, severity, message } = req.body;
    
    const alert = await Alert.create({
      patientId,
      severity,
      message
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getAlertsForCaregiver(req, res) {
  try {
    const caregiverId = req.user._id;

    // Find all patients linked to this caregiver
    const mappings = await PatientCaregiver.find({ caregiverId, status: 'Active' });
    const patientIds = mappings.map(m => m.patientId);

    // Get unread alerts for these patients
    const alerts = await Alert.find({
      patientId: { $in: patientIds },
      isRead: false
    })
    .populate('patientId', 'name username')
    .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function markAlertRead(req, res) {
  try {
    const { alertId } = req.params;
    
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { isRead: true },
      { returnDocument: 'after' }
    );

    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    res.status(200).json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
