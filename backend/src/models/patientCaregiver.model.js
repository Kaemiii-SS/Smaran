import mongoose from 'mongoose';

const patientCaregiverSchema = new mongoose.Schema({
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Inactive'],
    default: 'Active',
  }
}, { timestamps: true });

// Prevent duplicate mappings
patientCaregiverSchema.index({ caregiverId: 1, patientId: 1 }, { unique: true });

export default mongoose.model('PatientCaregiver', patientCaregiverSchema);
