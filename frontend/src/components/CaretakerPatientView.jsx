import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, Loader2, Target, Calendar, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CaretakerPatientView({ patient }) {
    const [activeTab, setActiveTab] = useState('progress');

    if (!patient) return null;

    return (
        <div className="flex flex-col h-full bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl shadow-xl overflow-hidden">
            {/* Header / Tabs */}
            <div className="bg-white/80 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#0f1912]">{patient.name}</h2>
                    <p className="text-sm font-bold text-[#1a2e22]/70">@{patient.username}</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('progress')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'progress' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Progress
                    </button>
                    <button 
                        onClick={() => setActiveTab('schedule')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'schedule' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Schedule
                    </button>
                    <button 
                        onClick={() => setActiveTab('chat')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Chat
                    </button>
                    <button 
                        onClick={() => setActiveTab('memory')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'memory' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Memory
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeTab === 'progress' && <ProgressTab patientId={patient._id} />}
                {activeTab === 'schedule' && <ScheduleTab patientId={patient._id} />}
                {activeTab === 'chat' && <ChatTab patientId={patient._id} />}
                {activeTab === 'memory' && <MemoryTab patientId={patient._id} />}
            </div>
        </div>
    );
}

function MemoryTab({ patientId }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !description || !image) return;

        setUploading(true);
        setSuccess(false);

        const formData = new FormData();
        formData.append('patientId', patientId);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/memory/upload`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess(true);
            setTitle('');
            setDescription('');
            setImage(null);
            
            // Clear file input
            const fileInput = document.getElementById('memory-file');
            if (fileInput) fileInput.value = '';
        } catch (err) {
            console.error('Error uploading memory:', err);
            alert('Failed to upload memory. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-extrabold text-[#0f1912] mb-6">Upload Memory of the Day</h3>
                {success && (
                    <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200">
                        Memory uploaded successfully! It will now appear on the patient's dashboard.
                    </div>
                )}
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Sarah's Wedding"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-emerald-700/50 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description / Location</label>
                        <input 
                            type="text" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. June 2015, Seattle"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-emerald-700/50 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Photo</label>
                        <input 
                            type="file"
                            id="memory-file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={uploading || !title || !description || !image}
                        className="w-full mt-4 bg-[#0f1912] disabled:bg-gray-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors"
                    >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload Memory'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function ProgressTab({ patientId }) {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/progress/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProgress(res.data.progress);
            } catch (err) {
                console.error("Failed to fetch progress", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, [patientId]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-800" /></div>;
    if (!progress || progress.length === 0) return <div className="text-center text-gray-500 font-bold p-8">No game data found for the last 30 days.</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#0f1912] flex items-center gap-2"><Target className="w-5 h-5"/> Game Performance (30 Days)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {progress.map((stat) => (
                    <div key={stat.gameId} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h4 className="text-lg font-extrabold text-emerald-900 capitalize mb-4">{stat.gameId.replace('_', ' ')}</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-emerald-50 p-3 rounded-xl">
                                <p className="text-xs font-bold text-emerald-700 uppercase">Avg Score</p>
                                <p className="text-2xl font-black text-emerald-950">{stat.averageScore}</p>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded-xl">
                                <p className="text-xs font-bold text-emerald-700 uppercase">Highest</p>
                                <p className="text-2xl font-black text-emerald-950">{stat.highestScore}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl col-span-2">
                                <p className="text-xs font-bold text-gray-500 uppercase">Games Played</p>
                                <p className="text-lg font-bold text-gray-800">{stat.totalGamesPlayed}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ScheduleTab({ patientId }) {
    const [routines, setRoutines] = useState([]);
    const [unfinishedRoutines, setUnfinishedRoutines] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newTime, setNewTime] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editTask, setEditTask] = useState('');
    const [editTime, setEditTime] = useState('');

    const formatTime12Hour = (time24) => {
        if (!time24) return '';
        const [hour, minute] = time24.split(':');
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minute} ${ampm}`;
    };

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const token = localStorage.getItem('token');
                const [routinesRes, unfinishedRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/routines/${patientId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/routines/${patientId}/unfinished`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setRoutines(routinesRes.data);
                setUnfinishedRoutines(unfinishedRes.data);
            } catch (err) {
                console.error("Failed to fetch routines", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, [patientId]);

    const handleAddRoutine = async (e) => {
        e.preventDefault();
        if(!newTask.trim() || !newTime) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/routines`, {
                patientId,
                taskName: newTask,
                timeOfDay: newTime,
                date: new Date()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewTask('');
            setNewTime('');
            fetchRoutines();
        } catch (err) {
            console.error("Failed to add routine", err);
        }
    };

    const handleDeleteRoutine = async (routineId) => {
        if (!window.confirm("Delete this routine?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/routines/${routineId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRoutines();
        } catch (err) {
            console.error("Failed to delete routine", err);
        }
    };

    const handleStartEdit = (routine) => {
        setEditingId(routine._id);
        setEditTask(routine.taskName);
        setEditTime(routine.timeOfDay);
    };

    const handleSaveEdit = async (routineId) => {
        if(!editTask.trim() || !editTime) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/api/routines/${routineId}`, {
                taskName: editTask,
                timeOfDay: editTime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingId(null);
            fetchRoutines();
        } catch (err) {
            console.error("Failed to update routine", err);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-800" /></div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-extrabold text-[#0f1912] mb-4 flex items-center gap-2"><Calendar className="w-5 h-5"/> Add Memory/Task</h3>
                <form onSubmit={handleAddRoutine} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                        placeholder="e.g. Take evening meds" 
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-emerald-700/50 outline-none"
                    />
                    <input 
                        type="time" 
                        value={newTime}
                        onChange={e => setNewTime(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-bold focus:ring-2 focus:ring-emerald-700/50 outline-none"
                    />
                    <button type="submit" className="bg-[#0f1912] text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-800 transition-colors">
                        Add
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-[#0f1912]">Today's Schedule</h3>
                {routines.length === 0 ? (
                    <p className="text-gray-500 font-bold">No tasks assigned for today.</p>
                ) : (
                    routines.map(routine => (
                        <div key={routine._id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            {editingId === routine._id ? (
                                <div className="flex items-center gap-3 w-full">
                                    <input 
                                        type="text" 
                                        value={editTask}
                                        onChange={e => setEditTask(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-bold focus:ring-2 focus:ring-emerald-700/50 outline-none text-sm"
                                    />
                                    <input 
                                        type="time" 
                                        value={editTime}
                                        onChange={e => setEditTime(e.target.value)}
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-bold focus:ring-2 focus:ring-emerald-700/50 outline-none text-sm"
                                    />
                                    <button onClick={() => handleSaveEdit(routine._id)} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${routine.isCompleted ? 'bg-emerald-500' : 'bg-yellow-400'}`}></div>
                                        <span className={`font-bold ${routine.isCompleted ? 'line-through text-gray-400' : 'text-[#0f1912]'}`}>{routine.taskName}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-extrabold text-emerald-800">{formatTime12Hour(routine.timeOfDay)}</span>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleStartEdit(routine)} className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteRoutine(routine._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Unfinished Tasks Section */}
            {unfinishedRoutines.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-extrabold text-red-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" /> 
                        Recent Unfinished Tasks
                    </h3>
                    {unfinishedRoutines.map(routine => (
                        <div key={routine._id} className="flex items-center justify-between bg-red-50/50 p-4 rounded-xl border border-red-100 shadow-sm">
                            <div className="flex flex-col">
                                <span className="font-bold text-red-900">{routine.taskName}</span>
                                <span className="text-xs font-bold text-red-700/70">
                                    {new Date(routine.date).toLocaleDateString()} at {formatTime12Hour(routine.timeOfDay)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded-lg">Missed</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ChatTab({ patientId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.id;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!userId || !token) return;

        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            query: { userId: userId }
        });
        
        setSocket(newSocket);
        newSocket.emit('join_room', userId);

        newSocket.on('receive_message', (message) => {
            // Only add if it belongs to this patient conversation
            const isRelated = 
                (typeof message.senderId === 'object' ? message.senderId._id : message.senderId) === patientId ||
                (typeof message.receiverId === 'object' ? message.receiverId._id : message.receiverId) === patientId;
            
            if (isRelated) {
                setMessages(prev => [...prev, message]);
            }
        });

        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/history/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(res.data);
            } catch (err) {
                console.error("Error fetching chat", err);
            }
        };

        fetchHistory();

        return () => newSocket.disconnect();
    }, [patientId, userId]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;
        socket.emit('send_message', {
            senderId: userId,
            receiverId: patientId,
            content: newMessage.trim()
        });
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-280px)] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 font-bold text-sm">No messages yet.</div>
                ) : (
                    messages.map((msg, idx) => {
                        const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
                        const isMine = senderId === userId;
                        return (
                            <motion.div key={msg._id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm text-sm font-bold ${isMine ? 'bg-[#0f1912] text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-[#0f1912] rounded-tl-sm'}`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/50" />
                    <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 p-2 bg-[#0f1912] disabled:bg-gray-400 text-white rounded-lg hover:bg-emerald-800 transition-colors">
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
