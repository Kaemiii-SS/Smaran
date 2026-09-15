import mongoose from 'mongoose';

const chatbotMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const chatbotSessionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [chatbotMessageSchema],
}, { timestamps: true });

export default mongoose.model('ChatbotSession', chatbotSessionSchema);
