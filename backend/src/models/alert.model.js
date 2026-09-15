import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
