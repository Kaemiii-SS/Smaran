import ChatbotSession from '../models/chatbotSession.model.js';

export async function sendMessage(req, res) {
  try {
    const { content } = req.body;
    const patientId = req.user._id;

    // 1. Fetch or create a session for today
    // For simplicity, we just keep one massive session per patient in MVP, 
    // or create a new one if none exists.
    let session = await ChatbotSession.findOne({ patientId });
    if (!session) {
      session = await ChatbotSession.create({ patientId, messages: [] });
    }

    // 2. Append user message
    session.messages.push({ role: 'user', content });

    // 3. Generate Mock AI Response
    // Since we don't have an LLM key yet, we'll respond with a generic but supportive message.
    const lowerContent = content.toLowerCase();
    let mockResponse = "I hear you. Let me know if you need help with your routine or playing a memory game.";
    
    if (lowerContent.includes("remember") || lowerContent.includes("forget")) {
      mockResponse = "It's completely normal to forget things sometimes. Should we check your daily reminders?";
    } else if (lowerContent.includes("game")) {
      mockResponse = "Playing games is a great idea! Try the 'Card Match' or 'Sequence' game on your dashboard.";
    } else if (lowerContent.includes("hello") || lowerContent.includes("hi")) {
      mockResponse = `Hello there! How are you feeling today?`;
    }

    // 4. Append AI message
    session.messages.push({ role: 'assistant', content: mockResponse });
    await session.save();

    res.status(200).json({
      message: 'Success',
      response: mockResponse,
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
