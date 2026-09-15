import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientSchedule() {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const fetchRoutines = useCallback(async (date) => {
        if (!user) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/routines/${user?.id}?date=${date.toISOString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoutines(res.data);
        } catch (error) {
            console.error("Error fetching routines:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            fetchRoutines(currentDate);
        }
    }, [currentDate, user?.id]);

    const handleComplete = async (routineId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/routines/${routineId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local
            setRoutines(prev => prev.map(r => r._id === routineId ? { ...r, isCompleted: true } : r));
        } catch (error) {
            console.error("Error completing routine:", error);
        }
    };

    const formatTime12Hour = (time24) => {
        if (!time24) return '';
        const [hour, minute] = time24.split(':');
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minute} ${ampm}`;
    };

    const handlePrevDay = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 1);
        setCurrentDate(d);
    };

    const handleNextDay = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 1);
        
        // Prevent going to future days
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (d > today) return;
        
        setCurrentDate(d);
    };

    const isTodayOrFuture = () => {
        const d = new Date(currentDate);
        const today = new Date();
        return d.setHours(0,0,0,0) >= today.setHours(0,0,0,0);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    const completedCount = routines.filter(r => r.isCompleted).length;
    const progress = routines.length === 0 ? 0 : (completedCount / routines.length) * 100;

    return (
        <motion.div 
            className="w-full max-w-4xl mx-auto pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-[#0f1912] flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-emerald-800" />
                        My Schedule
                    </h2>
                    <p className="text-[#1a2e22]/70 font-bold mt-1">Keep track of your daily tasks and activities.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/60 p-2 rounded-xl border border-white/50 shadow-sm">
                    <button onClick={handlePrevDay} className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm text-[#0f1912] transition-colors">&larr; Prev</button>
                    <button onClick={handleToday} className="px-3 py-1 text-emerald-800 font-extrabold text-sm hover:underline">{currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</button>
                    <button 
                        onClick={handleNextDay} 
                        disabled={isTodayOrFuture()}
                        className={`px-3 py-1 rounded-lg font-bold text-sm transition-colors ${isTodayOrFuture() ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 border border-gray-200 text-[#0f1912]'}`}
                    >
                        Next &rarr;
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm mb-8">
                <div className="flex justify-between items-end mb-2">
                    <span className="font-extrabold text-[#0f1912]">Daily Progress</span>
                    <span className="font-bold text-emerald-800 text-sm">{completedCount} of {routines.length} completed</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-emerald-500 rounded-full"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-700" /></div>
            ) : routines.length === 0 ? (
                <div className="text-center py-16 bg-white/50 border border-white/50 rounded-3xl">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-extrabold text-gray-600 mb-2">No tasks scheduled</h3>
                    <p className="text-gray-500 font-bold">You have a free day today. Relax and enjoy!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {routines.map((routine) => (
                        <motion.div 
                            key={routine._id}
                            variants={itemVariants}
                            className={`flex items-center p-5 rounded-2xl border transition-all ${
                                routine.isCompleted 
                                ? 'bg-gray-50 border-gray-200 opacity-70' 
                                : 'bg-white border-emerald-100 shadow-sm hover:shadow-md'
                            }`}
                        >
                            <button 
                                onClick={() => !routine.isCompleted && handleComplete(routine._id)}
                                disabled={routine.isCompleted}
                                className={`mr-6 flex-shrink-0 transition-transform ${routine.isCompleted ? 'cursor-default' : 'hover:scale-110 cursor-pointer'}`}
                            >
                                {routine.isCompleted ? (
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                ) : (
                                    <Circle className="w-8 h-8 text-gray-300 hover:text-emerald-500 transition-colors" />
                                )}
                            </button>
                            
                            <div className="flex-1">
                                <h3 className={`text-lg font-extrabold ${routine.isCompleted ? 'text-gray-500 line-through' : 'text-[#0f1912]'}`}>
                                    {routine.taskName}
                                </h3>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mt-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatTime12Hour(routine.timeOfDay)}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
