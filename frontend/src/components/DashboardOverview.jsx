import { CheckCircle2, AlertCircle, ImageIcon, Flame, Gamepad2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
    const streakData = Array.from({ length: 42 }, () => Math.floor(Math.random() * 4));
    const isRoutineCompleted = false; 

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
                            {isRoutineCompleted ? "Morning Routine Completed!" : "Action Required: Morning Routine"}
                        </h3>
                        <p className={`text-sm font-bold opacity-80 ${isRoutineCompleted ? 'text-emerald-900' : 'text-red-900'}`}>
                            {isRoutineCompleted ? "Great job! You've taken your meds and had breakfast." : "You haven't taken your 9:00 AM medication yet."}
                        </p>
                    </div>
                </div>
                {!isRoutineCompleted && (
                    <motion.button 
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
                            <span className="text-sm font-bold bg-white/10 text-white px-4 py-1.5 rounded-full border border-white/10">12 Days Active</span>
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
                    <motion.div variants={itemVariants} className="bg-white/90 border border-white/50 rounded-[2rem] p-6 shadow-lg flex flex-col h-[300px]">
                        <h3 className="text-xl font-extrabold text-[#0f1912] mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-800" /> Daily Reminders
                        </h3>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {['Take Morning Meds (Done)', 'Eat Breakfast (Done)', 'Play Memory Game', 'Afternoon Walk', 'Call Michael'].map((task, i) => (
                                <label key={i} className="flex items-center gap-4 p-3.5 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm">
                                    <input type="checkbox" defaultChecked={i < 2} className="w-5 h-5 accent-emerald-700 rounded-md cursor-pointer" />
                                    <span className={`text-sm font-bold ${i < 2 ? 'line-through text-[#1a2e22]/50' : 'text-[#0f1912]'}`}>{task}</span>
                                </label>
                            ))}
                        </div>
                    </motion.div>

                    {/* Memory of the Day */}
                    <motion.div variants={itemVariants} className="bg-white/90 border border-white/50 rounded-[2rem] p-6 shadow-lg flex flex-col group overflow-hidden relative h-[300px]">
                        <h3 className="text-xl font-extrabold text-[#0f1912] mb-4 flex items-center gap-2 relative z-10">
                            <ImageIcon className="w-5 h-5 text-emerald-800" /> Memory of the Day
                        </h3>
                        <div className="flex-1 w-full bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 shadow-inner flex flex-col items-center justify-end p-4">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop" 
                                alt="Family Memory" 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            />
                            <div className="relative z-20 text-center w-full transform transition-transform duration-300 group-hover:-translate-y-1">
                                <p className="text-white font-extrabold text-lg mb-1 drop-shadow-md">Sarah's Wedding</p>
                                <p className="text-white/90 font-bold text-xs drop-shadow-md">June 2015, Seattle</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cognitive Games */}
                    <motion.div variants={itemVariants} className="bg-white/90 border border-white/50 rounded-[2rem] p-6 shadow-lg md:col-span-2 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-extrabold text-[#0f1912] flex items-center gap-2">
                                <Gamepad2 className="w-5 h-5 text-emerald-800" /> Cognitive Games
                            </h3>
                            <button className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-[#0f1912] px-4 py-2 rounded-full border border-gray-200 transition-colors">
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all shadow-sm flex flex-col items-center justify-center">
                                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">🧩</span>
                                </div>
                                <p className="font-extrabold text-[#0f1912] text-sm">Card Match</p>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all shadow-sm flex flex-col items-center justify-center">
                                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">📸</span>
                                </div>
                                <p className="font-extrabold text-[#0f1912] text-sm">Face Recall</p>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center transition-all shadow-sm flex flex-col items-center justify-center">
                                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">🔢</span>
                                </div>
                                <p className="font-extrabold text-[#0f1912] text-sm">Sequence</p>
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
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex justify-start">
                            <div className="bg-gray-100 border border-gray-200 text-[#0f1912] text-sm font-bold p-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm leading-relaxed">
                                Good morning, John! How are you feeling today? Did you sleep well?
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex justify-end">
                            <div className="bg-[#0f1912] text-white text-sm font-bold p-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md leading-relaxed">
                                I feel good. I slept okay, but I can't remember what time my son is calling.
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex justify-start">
                            <div className="bg-gray-100 border border-gray-200 text-[#0f1912] text-sm font-bold p-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm leading-relaxed">
                                Your son Michael is scheduled to call you at 4:00 PM today. I will remind you again at 3:45 PM. Would you like to play a quick memory game while we wait?
                            </div>
                        </motion.div>
                    </div>

                    <div className="p-5 bg-white border-t border-gray-200 z-10">
                        <div className="relative flex items-center">
                            <input 
                                type="text" 
                                placeholder="Ask anything..." 
                                className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f1912] font-semibold placeholder-[#1a2e22]/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 shadow-inner"
                            />
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute right-2 p-2.5 bg-[#0f1912] hover:bg-emerald-800 text-white rounded-xl transition-colors shadow-md"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}