import { Server } from 'socket.io';
import Message from './models/message.model.js';

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins their own personal room using their database userId
    socket.on('join_room', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    // Handle sending a message
    socket.on('send_message', async (data) => {
      const { senderId, receiverId, content } = data;
      
      try {
        // 1. Save to database
        const newMessage = await Message.create({
          senderId,
          receiverId,
          content,
          isRead: false
        });

        // Populate sender info so frontend has name/username immediately
        await newMessage.populate('senderId', 'name username role');

        // 2. Emit to the receiver's personal room
        io.to(receiverId).emit('receive_message', newMessage);
        
        // 3. Also emit back to the sender so their UI updates if needed
        io.to(senderId).emit('receive_message', newMessage);

      } catch (error) {
        console.error('Error saving/sending message via socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
