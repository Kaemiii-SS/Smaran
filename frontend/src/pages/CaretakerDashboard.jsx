import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Loader2, Search, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
import CaretakerTopbar from '../components/CaretakerTopbar';
import CaretakerPatientView from '../components/CaretakerPatientView';

export default function CaretakerDashboard() {
    const [roster, setRoster] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    
    const isProfilePage = location.pathname.includes('/profile');

    useEffect(() => {
        const fetchRoster = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/roster`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoster(res.data);
                
                // Select first patient by default if available
                if (res.data.length > 0) {
                    setSelectedPatient(res.data[0].patient);
                }
            } catch (err) {
                console.error("Failed to fetch roster", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoster();
    }, []);

    const filteredRoster = roster.filter(item => 
        item.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.patient.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#8cb691] overflow-hidden" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            
            {/* Optimized SVG Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80">
                <svg className="absolute top-0 left-0 w-full h-full object-cover" preserveAspectRatio="xMidYMin slice" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,0 V650 C200,600 350,800 550,650 C750,500 800,250 1050,350 C1300,450 1350,700 1440,600 V0 Z" fill="#9bc1a0" />
                    <path d="M0,0 V450 C150,500 350,300 550,400 C750,500 850,800 1100,650 C1300,530 1350,350 1440,450 V0 Z" fill="#b0cfb4" />
                    <path d="M0,0 V250 C200,350 400,150 600,250 C800,350 950,600 1200,450 C1350,350 1400,200 1440,300 V0 Z" fill="#cbe5cf" />
                </svg>
            </div>

            {/* Sidebar / Patient List */}
            <aside className="w-80 bg-white/40 backdrop-blur-xl border-r border-white/50 flex flex-col z-20 shadow-[4px_0_24px_-10px_rgba(15,25,18,0.2)]">
                <div className="p-6 border-b border-white/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center shadow-md">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-[#0f1912] tracking-tight">Smaran</h2>
                    </div>
                </div>

                <div className="p-4 border-b border-white/30">
                    <div className="relative">
                        <Search className="w-4 h-4 text-[#1a2e22]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/50 border border-white/80 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-[#0f1912] placeholder-[#1a2e22]/50 focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-emerald-800" /></div>
                    ) : filteredRoster.length === 0 ? (
                        <div className="text-center p-8 text-[#1a2e22]/70 font-bold text-sm">
                            No assigned patients found.
                        </div>
                    ) : (
                        filteredRoster.map((item) => (
                            <button
                                key={item.patient._id}
                                onClick={() => setSelectedPatient(item.patient)}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border ${
                                    selectedPatient?._id === item.patient._id 
                                    ? 'bg-white border-emerald-200 shadow-md transform scale-[1.02]' 
                                    : 'bg-white/40 border-transparent hover:bg-white/60 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-800 font-black rounded-full flex items-center justify-center border border-emerald-200">
                                        {item.patient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-[#0f1912]">{item.patient.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-bold text-[#1a2e22]/60">Streak: {item.streak.currentStreak} 🔥</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                <CaretakerTopbar />
                
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 transform-gpu will-change-scroll custom-scrollbar">
                    {isProfilePage ? (
                        <Outlet />
                    ) : selectedPatient ? (
                        <motion.div 
                            key={selectedPatient._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="h-full"
                        >
                            <CaretakerPatientView patient={selectedPatient} />
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg">
                            <Users className="w-16 h-16 text-emerald-800/50 mb-4" />
                            <h2 className="text-2xl font-extrabold text-[#0f1912] mb-2">Select a Patient</h2>
                            <p className="text-[#1a2e22]/70 font-bold max-w-md">Choose a patient from the sidebar to view their progress, schedule routines, or chat with them.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
