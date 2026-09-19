import ChatbotSession from '../models/chatbotSession.model.js';
import { askGeminiWithHistory as generateChatResponse } from '../gemini/gemini.service.js';

export async function sendMessage(req, res) {
  try {
    const { content } = req.body;
    const patientId = req.user._id;

    // 1. Fetch or create a session for today
    let session = await ChatbotSession.findOne({ patientId });
    if (!session) {
      session = await ChatbotSession.create({ patientId, messages: [] });
    }

    // 2. Get history before adding the new message
    const history = [...session.messages];

    // 3. Append user message to the db session
    session.messages.push({ role: 'user', content });

    // 4. Generate AI Response using Gemini
    const aiResponse = await generateChatResponse(content, history);

    // 5. Append AI message to the db session
    session.messages.push({ role: 'assistant', content: aiResponse });
    await session.save();

    // The frontend expects the AI's message in the `reply` field.
    res.status(200).json({
      message: 'Success',
      reply: aiResponse,
      session
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getChatHistory(req, res) {
  try {
    const { patientId } = req.params;
    
    const session = await ChatbotSession.findOne({ patientId });
    if (!session) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: session.messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
