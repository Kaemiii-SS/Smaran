import { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function ChatHistory() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [caretaker, setCaretaker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');
    const userId = user?.id;
    const userRole = user?.role;

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!userId || !token) return;

        // Initialize Socket
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            query: { userId: userId }
        });
        
        setSocket(newSocket);

        // Join personal room
        newSocket.emit('join_room', userId);

        // Listen for incoming messages
        newSocket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        const fetchChatData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // 1. Fetch Caretaker
                let caretakerId;
                if (userRole === 'Patient') {
                    const rosterRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/roster/my-caretaker`, config);
                    setCaretaker(rosterRes.data);
                    caretakerId = rosterRes.data._id;
                } else {
                    // If a Caretaker is logged in, this would need a selector.
                    // For now, assume this view is primarily for the Patient.
                    console.log("Caretaker view not fully implemented for chat yet.");
                    setLoading(false);
                    return;
                }

                // 2. Fetch Chat History
                if (caretakerId) {
                    const historyRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/history/${caretakerId}`, config);
                    setMessages(historyRes.data);
                }

            } catch (error) {
                console.error("Error fetching chat data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatData();

        // Cleanup
        return () => {
            newSocket.disconnect();
        };
    }, [userId, userRole, token]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !caretaker) return;

        const messageData = {
            senderId: userId,
            receiverId: caretaker._id,
            content: newMessage.trim()
        };

        // Emit to server
        socket.emit('send_message', messageData);
        
        // Optimistically add to UI (optional, but socket server also emits it back)
        // We'll let the server emit it back to us via 'receive_message' to ensure it was saved.
        
        setNewMessage('');
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    if (!caretaker) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-center p-8">
                <h2 className="text-3xl font-extrabold text-[#0f1912] mb-4">Chat</h2>
                <p className="text-white font-bold max-w-md bg-white/20 p-6 rounded-2xl border border-white/30 shadow-md">
                    You do not currently have a caretaker assigned. Please contact support or update your profile to link with a caretaker.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-[1000px] mx-auto bg-white/90 border border-white/50 rounded-[2rem] shadow-xl overflow-hidden">
            
            {/* Chat Header */}
            <div className="flex items-center gap-4 p-6 border-b border-gray-200 bg-white z-10">
                <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                    <UserIcon className="w-6 h-6 text-emerald-800" />
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-[#0f1912]">{caretaker.name}</h2>
                    <p className="text-sm font-bold text-[#1a2e22]/70">Your Caretaker</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 font-bold text-sm">
                        No messages yet. Say hello!
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        // Check if senderId is an object (populated) or just a string ID
                        const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
                        const isMine = senderId === userId;

                        return (
                            <motion.div 
                                key={msg._id || idx}
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm leading-relaxed text-sm font-bold ${
                                    isMine 
                                    ? 'bg-[#0f1912] text-white rounded-tr-sm' 
                                    : 'bg-white border border-gray-200 text-[#0f1912] rounded-tl-sm'
                                }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-5 bg-white border-t border-gray-200 z-10">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..." 
                        className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f1912] font-semibold placeholder-[#1a2e22]/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 shadow-inner"
                    />
                    <motion.button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-2 p-2.5 bg-[#0f1912] disabled:bg-gray-400 hover:bg-emerald-800 text-white rounded-xl transition-colors shadow-md"
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
