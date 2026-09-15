import Message from '../models/message.model.js';

export async function getConversationHistory(req, res) {
  try {
    const currentUserId = req.user._id;
    const { otherUserId } = req.params;

    // Fetch messages where the current user is sender and other is receiver, OR vice versa
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    })
    .populate('senderId', 'name username role')
    .sort({ createdAt: 1 }); // Oldest first for chat history

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
