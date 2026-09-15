import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caretakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Memory = mongoose.model('Memory', memorySchema);
export default Memory;
