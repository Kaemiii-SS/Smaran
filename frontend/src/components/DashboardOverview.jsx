import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, ImageIcon, Flame, Gamepad2, Send, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DashboardOverview() {
    const navigate = useNavigate();
    const [routines, setRoutines] = useState([]);
    const [streak, setStreak] = useState({ currentStreak: 0 });
    const [memory, setMemory] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState(false);
    const remindersRef = useRef(null);
    
    // Get user from localStorage
    const userString = localStorage.getItem('user');

    useEffect(() => {
        const fetchRoutines = async (userData) => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/routines/${userData.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Sort by time
                const sortedRoutines = res.data.sort((a, b) => {
                    return a.timeOfDay.localeCompare(b.timeOfDay);
                });
                
                setRoutines(sortedRoutines);
            } catch (err) {
                console.error("Failed to fetch routines", err);
            }
        };

        const fetchMemory = async (userData) => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/memory/${userData.id}/latest`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMemory(res.data);
            } catch (err) {
                // It's ok if no memory is found
            }
        };

        const fetchAnalytics = async (userData) => {
            try {
                const token = localStorage.getItem('token');
                const analyticsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/${userData.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (analyticsRes.data.streak) {
                    setStreak(analyticsRes.data.streak);
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
        };

        const fetchChatHistory = async (userData) => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chatbot/history/${userData.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.length > 0) {
                    setChatMessages(res.data);
                } else {
                    setChatMessages([
                        { sender: 'ai', content: `Good morning, ${userData.name}! How are you feeling today?` }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching chat history:", error);
                setChatMessages([
                    { sender: 'ai', content: `Good morning, ${userData.name}! How are you feeling today?` }
                ]);
            }
        };

        if (userString) {
            const userData = JSON.parse(userString);
            fetchRoutines(userData);
            fetchMemory(userData);
            fetchAnalytics(userData);
            fetchChatHistory(userData);
        } else {
            navigate('/login');
        }
    }, [navigate, userString]);

    const handleRoutineComplete = async (routineId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/routines/${routineId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update local state
            setRoutines(prev => prev.map(r => r._id === routineId ? { ...r, isCompleted: true } : r));
        } catch (error) {
            console.error("Error completing routine:", error);
        }
    };

    const handleChatSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!chatInput.trim() || chatLoading) return;

        const messageText = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { sender: 'user', content: messageText }]);
        setChatLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chatbot/message`, {
                message: messageText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setChatMessages(prev => [...prev, { sender: 'ai', content: res.data.reply }]);
        } catch (error) {
            console.error("Error sending message to chatbot:", error);
            setChatMessages(prev => [...prev, { sender: 'ai', content: "Sorry, I am having trouble connecting right now." }]);
        } finally {
            setChatLoading(false);
        }
    };

    // Check if ALL routines are completed today (if there are any routines)
    const isRoutineCompleted = routines.length > 0 && routines.every(r => r.isCompleted);
    
    const formatTime12Hour = (time24) => {
        if (!time24) return '';
        const [hour, minute] = time24.split(':');
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minute} ${ampm}`;
    };
    
    // Generate heatmap array based on current streak
    const streakData = Array.from({ length: 42 }, (_, i) => {
        if (i < streak.currentStreak) return Math.floor(Math.random() * 2) + 1; // Return 1 or 2 for green shades
        return 0; // Empty
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 } // Sped up the stagger slightly
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 }, // Reduced travel distance
        show: { 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 20 }
        }
    };

    return (
        <motion.div 
            className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Top Alert Banner - Removed backdrop blur */}
            <motion.div 
                variants={itemVariants}
                className={`p-4 sm:p-5 rounded-2xl border shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-500 ${isRoutineCompleted ? 'bg-[#d1e8d5] border-emerald-500/30' : 'bg-[#fce8e8] border-red-500/30'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isRoutineCompleted ? 'bg-emerald-500/20 text-emerald-800' : 'bg-red-500/20 text-red-700'}`}>
                        {isRoutineCompleted ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className={`text-lg font-extrabold ${isRoutineCompleted ? 'text-emerald-900' : 'text-red-900'}`}>
                            {isRoutineCompleted ? "All Routines Completed!" : "Action Required: Pending Routines"}
                        </h3>
                        <p className={`text-sm font-bold opacity-80 ${isRoutineCompleted ? 'text-emerald-900' : 'text-red-900'}`}>
                            {isRoutineCompleted ? "Great job! You've finished everything for today." : "You have uncompleted tasks in your daily schedule."}
                        </p>
                    </div>
                </div>
                {!isRoutineCompleted && (
                    <motion.button 
                        onClick={() => remindersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-sm shadow-md transition-colors whitespace-nowrap"
                    >
                        Complete Now
                    </motion.button>
                )}
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Activity Streak */}
                    <motion.div variants={itemVariants} className="bg-[#0f1912] border border-emerald-900/50 rounded-[2rem] p-6 shadow-lg md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-500" /> Activity Streak
                            </h3>
                            <span className="text-sm font-bold bg-white/10 text-white px-4 py-1.5 rounded-full border border-white/10">{streak.currentStreak} Days Active</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                            {streakData.map((val, idx) => {
                                const colors = ['bg-white/10', 'bg-emerald-500/40', 'bg-emerald-500/70', 'bg-emerald-400'];
                                return (
                                    <div 
                                        key={idx} 
                                        className={`w-5 h-5 rounded-[4px] ${colors[val]} transition-colors hover:border hover:border-white`}
                                        title={`${val} activities completed`}
                                    />
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Daily Reminders - Replaced blur with solid bg-white/90 */}
                    <motion.div ref={remindersRef} variants={itemVariants} className="bg-white/90 border border-white/50 rounded-[2rem] p-6 shadow-lg flex flex-col h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-extrabold text-[#0f1912] flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-800" /> Daily Reminders
                            </h3>
                            <button 
                                onClick={() => navigate('/dashboard/schedule')}
                                className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-[#0f1912] px-4 py-2 rounded-full border border-gray-200 transition-colors"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {routines.length === 0 ? (
                                <p className="text-sm font-bold text-gray-400">No routines scheduled for today.</p>
                            ) : (
                                routines.map((task) => (
                                    <label key={task._id} className="flex items-center gap-4 p-3.5 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm">
                                        <input 
                                            type="checkbox" 
                                            checked={task.isCompleted} 
                                            onChange={() => !task.isCompleted && handleRoutineComplete(task._id)}
                                            disabled={task.isCompleted}
                                            className="w-5 h-5 accent-emerald-700 rounded-md cursor-pointer disabled:opacity-50" 
                                        />
                                        <span className={`text-sm font-bold flex-1 ${task.isCompleted ? 'line-through text-[#1a2e22]/50' : 'text-[#0f1912]'}`}>{task.taskName}</span>
                                        <span className="text-xs font-bold text-gray-400">{formatTime12Hour(task.timeOfDay)}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Memory of the Day */}
                    <motion.div variants={itemVariants} className="bg-white/90 border border-white/50 rounded-[2rem] p-6 shadow-lg flex flex-col group overflow-hidden relative h-[300px]">
                        <h3 className="text-xl font-extrabold text-[#0f1912] mb-4 flex items-center gap-2 relative z-10">
                            <ImageIcon className="w-5 h-5 text-emerald-800" /> Memory of the Day
                        </h3>
                        <div 
                            onClick={() => memory && setSelectedMemory(true)}
                            className={`flex-1 w-full bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 shadow-inner flex flex-col items-center justify-center p-4 ${memory ? 'cursor-pointer' : ''}`}
                        >
                            {memory ? (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none"></div>
                                    <img 
                                        src={memory.imageUrl} 
                                        alt={memory.title} 
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                    <div className="relative z-20 text-center w-full mt-auto transform transition-transform duration-300 group-hover:-translate-y-1">
                                        <p className="text-white font-extrabold text-lg mb-1 drop-shadow-md">{memory.title}</p>
                                        <p className="text-white/90 font-bold text-xs drop-shadow-md line-clamp-1">{memory.description}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p className="font-bold text-sm">No memory uploaded today.</p>
                                    <p className="text-xs">Your caretaker can add one.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Cognitive Games */}
                    <motion.div variants={itemVariants} className="bg-white/90 border border-white/50 rounded-[2rem] p-6 shadow-lg md:col-span-2 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-extrabold text-[#0f1912] flex items-center gap-2">
                                <Gamepad2 className="w-5 h-5 text-emerald-800" /> Cognitive Games
                            </h3>
                            <button 
                                onClick={() => navigate('/dashboard/games')}
                                className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-[#0f1912] px-4 py-2 rounded-full border border-gray-200 transition-colors"
                            >
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 h-full">
                            <motion.button 
                                onClick={() => navigate('/game/find-it')}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                                className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all shadow-sm flex flex-col items-center justify-center"
                            >
                                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">🔍</span>
                                </div>
                                <p className="font-extrabold text-[#0f1912] text-sm">Find It</p>
                            </motion.button>
                            <motion.button 
                                onClick={() => navigate('/game/constellation')}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                                className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all shadow-sm flex flex-col items-center justify-center"
                            >
                                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">🗺️</span>
                                </div>
                                <p className="font-extrabold text-[#0f1912] text-sm">Constellation</p>
                            </motion.button>
                            <motion.button 
                                onClick={() => navigate('/game/follow-the-rhythm')}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                                className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all shadow-sm flex flex-col items-center justify-center"
                            >
                                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">🎵</span>
                                </div>
                                <p className="font-extrabold text-[#0f1912] text-sm">Follow Rhythm</p>
                            </motion.button>
                            <motion.button 
                                onClick={() => navigate('/game/name-game')}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                                className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all shadow-sm flex flex-col items-center justify-center"
                            >
                                <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">👁️</span>
                                </div>
                                <p className="font-extrabold text-[#0f1912] text-sm">See & Say</p>
                            </motion.button>
                        </div>
                    </motion.div>

                </div>

                {/* Right Side (AI Chatbot) - Replaced blur with solid bg */}
                <motion.div variants={itemVariants} className="xl:col-span-4 flex flex-col bg-white/90 border border-white/50 rounded-[2.5rem] shadow-lg overflow-hidden h-[600px] xl:h-auto">
                    
                    <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="font-extrabold text-[#0f1912] text-lg">Smaran Assistant</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <motion.div 
                                        animate={{ opacity: [1, 0.5, 1] }} 
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-2 h-2 rounded-full bg-emerald-500"
                                    />
                                    <p className="text-xs font-bold text-[#1a2e22]/70">Always here to help</p>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            onClick={() => navigate('/dashboard/ai-chat')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Open full AI chat"
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-colors shadow-sm"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Full Chat
                        </motion.button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {chatMessages.map((msg, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`text-sm font-bold p-4 max-w-[85%] shadow-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                    ? 'bg-[#0f1912] text-white rounded-2xl rounded-tr-sm shadow-md' 
                                    : 'bg-gray-100 border border-gray-200 text-[#0f1912] rounded-2xl rounded-tl-sm'
                                }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {chatLoading && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start">
                                <div className="bg-gray-100 border border-gray-200 text-[#0f1912] text-sm font-bold p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce delay-100">.</span>
                                    <span className="animate-bounce delay-200">.</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <form onSubmit={handleChatSubmit} className="p-5 bg-white border-t border-gray-200 z-10">
                        <div className="relative flex items-center">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask anything..." 
                                className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f1912] font-semibold placeholder-[#1a2e22]/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 shadow-inner"
                            />
                            <motion.button 
                                type="submit"
                                disabled={chatLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute right-2 p-2.5 bg-[#0f1912] disabled:bg-gray-400 hover:bg-emerald-800 text-white rounded-xl transition-colors shadow-md"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

            </div>
            
            {/* Memory Modal */}
            <AnimatePresence>
                {selectedMemory && memory && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div 
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedMemory(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row z-10"
                        >
                            <button 
                                onClick={() => setSelectedMemory(false)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-full md:w-3/5 h-64 md:h-[500px] relative bg-black">
                                <img 
                                    src={memory.imageUrl} 
                                    alt={memory.title} 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-emerald-50 to-white">
                                <p className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-4">Memory of the Day</p>
                                <h2 className="text-3xl md:text-4xl font-black text-[#0f1912] mb-4 leading-tight">{memory.title}</h2>
                                <div className="w-12 h-1.5 bg-emerald-500 rounded-full mb-6"></div>
                                <p className="text-gray-600 font-medium text-lg leading-relaxed">{memory.description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}