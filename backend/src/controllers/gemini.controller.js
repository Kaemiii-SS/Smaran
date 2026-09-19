import { askGemini, askGeminiWithHistory } from '../gemini/gemini.service.js';
import ChatbotSession from '../models/chatbotSession.model.js';

/* ------------------------------------------------------------------ */
/*  POST /api/gemini/ask                                                */
/*  Body: { message: string }                                           */
/*  One-shot prompt, no history. Does NOT persist to DB.               */
/* ------------------------------------------------------------------ */
export async function ask(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required and must be a non-empty string.' });
    }

    const reply = await askGemini(message.trim());
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('[Gemini] ask error:', error);
    return res.status(500).json({ error: 'Failed to get a response from Gemini.' });
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/gemini/chat                                               */
/*  Body: { message: string }                                           */
/*  Loads history from DB → calls Gemini → saves both turns to DB.     */
/* ------------------------------------------------------------------ */
export async function chat(req, res) {
  try {
    const { message } = req.body;
    const patientId = req.user._id;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required and must be a non-empty string.' });
    }

    // 1. Load or create the session for this patient
    let session = await ChatbotSession.findOne({ patientId });
    if (!session) {
      session = await ChatbotSession.create({ patientId, messages: [] });
    }

    // 2. Snapshot history before appending the new message
    const history = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // 3. Persist user message
    session.messages.push({ role: 'user', content: message.trim() });

    // 4. Call Gemini with full history for context
    const reply = await askGeminiWithHistory(message.trim(), history);

    // 5. Persist assistant reply
    session.messages.push({ role: 'assistant', content: reply });
    await session.save();

    return res.status(200).json({ reply, sessionId: session._id });
  } catch (error) {
    console.error('[Gemini] chat error:', error);
    return res.status(500).json({ error: 'Failed to get a response from Gemini.' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/gemini/history                                             */
/*  Returns the full conversation history for the logged-in patient.   */
/* ------------------------------------------------------------------ */
export async function getHistory(req, res) {
  try {
    const patientId = req.user._id;

    const session = await ChatbotSession.findOne({ patientId });
    if (!session) {
      return res.status(200).json({ messages: [] });
    }

    return res.status(200).json({ messages: session.messages });
  } catch (error) {
    console.error('[Gemini] getHistory error:', error);
    return res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/gemini/history                                          */
/*  Clears the conversation history for the logged-in patient.         */
/* ------------------------------------------------------------------ */
export async function clearHistory(req, res) {
  try {
    const patientId = req.user._id;

    await ChatbotSession.findOneAndUpdate(
      { patientId },
      { $set: { messages: [] } },
      { returnDocument: 'after' }
    );

    return res.status(200).json({ message: 'Chat history cleared.' });
  } catch (error) {
    console.error('[Gemini] clearHistory error:', error);
    return res.status(500).json({ error: 'Failed to clear chat history.' });
  }
}
