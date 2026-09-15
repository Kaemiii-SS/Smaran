import { Home, Gamepad2, MessageSquare, Calendar, Settings, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className="w-20 lg:w-24 h-full bg-white/30 backdrop-blur-xl border-r border-white/50 flex flex-col items-center py-8 z-20 flex-shrink-0 shadow-[4px_0_24px_-10px_rgba(15,25,18,0.2)]">
            <Link to="/" className="flex items-center justify-center w-12 h-12 bg-white/60 border border-white/80 rounded-xl mb-12 shadow-sm transition-transform hover:scale-105">
                <Brain className="w-6 h-6 text-emerald-800" />
            </Link>

            <nav className="flex flex-col gap-8 flex-1">
                <Link to="/dashboard" className="p-3 bg-[#0f1912] text-white rounded-xl shadow-md group relative">
                    <Home className="w-6 h-6" />
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#0f1912] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Overview</span>
                </Link>
                <Link to="/dashboard/games" className="p-3 text-[#1a2e22] hover:bg-white/50 rounded-xl transition-colors group relative">
                    <Gamepad2 className="w-6 h-6" />
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#0f1912] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Games</span>
                </Link>
                <Link to="/dashboard/chat" className="p-3 text-[#1a2e22] hover:bg-white/50 rounded-xl transition-colors group relative">
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#0f1912] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Chat History</span>
                </Link>
                <Link to="/dashboard/schedule" className="p-3 text-[#1a2e22] hover:bg-white/50 rounded-xl transition-colors group relative">
                    <Calendar className="w-6 h-6" />
                    <span className="absolute left-full ml-4 px-2 py-1 bg-[#0f1912] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Schedule</span>
                </Link>
            </nav>

            <button className="p-3 text-[#1a2e22] hover:bg-white/50 rounded-xl transition-colors mt-auto">
                <Settings className="w-6 h-6" />
            </button>
        </aside>
    );
}