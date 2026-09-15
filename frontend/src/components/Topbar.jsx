import { Search, Bell, MessageSquare, User } from 'lucide-react';

export default function Topbar() {
    return (
        <header className="h-24 px-8 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-sm z-10 flex-shrink-0">
            <div>
                <h1 className="text-3xl font-extrabold text-[#0f1912] tracking-tight">Overview</h1>
                <p className="text-sm font-bold text-[#1a2e22]/80 mt-1">Welcome back, John. Let's make today a good day.</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center bg-white/40 border border-white/50 rounded-full px-4 py-2">
                    <Search className="w-4 h-4 text-[#1a2e22]/60 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-transparent border-none outline-none text-sm font-bold text-[#0f1912] placeholder-[#1a2e22]/50 w-32 focus:w-48 transition-all"
                    />
                </div>
                
                <button className="relative p-2 bg-white/40 border border-white/50 rounded-full hover:bg-white/60 transition-colors">
                    <Bell className="w-5 h-5 text-[#0f1912]" />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#8cb691]"></span>
                </button>

                {/* Changed to Chat Caretaker */}
                <button className="flex items-center gap-2 bg-emerald-800 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Caretaker</span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/30">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-extrabold text-[#0f1912]">John Doe</p>
                        <p className="text-xs font-bold text-[#1a2e22]/70">Patient</p>
                    </div>
                    <div className="w-10 h-10 bg-white border border-white/50 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                        <User className="w-5 h-5 text-emerald-800" />
                    </div>
                </div>
            </div>
        </header>
    );
}