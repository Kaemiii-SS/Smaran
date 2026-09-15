import mongoose from 'mongoose';

const routineSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  timeOfDay: {
    type: String, // format "HH:MM"
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Routine', routineSchema);
