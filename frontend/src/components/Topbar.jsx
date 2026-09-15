import { Search, Bell, MessageSquare, User as UserIcon, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
    const [user, setUser] = useState({ name: 'Guest', role: 'Patient', username: 'guest' });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/dashboard/games?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            setUser(JSON.parse(userString));
        }
    }, []);

    return (
        <header className="h-24 px-8 flex items-center justify-between border-b border-white/20 bg-white/10 backdrop-blur-sm z-10 flex-shrink-0">
            <div>
                <h1 className="text-3xl font-extrabold text-[#0f1912] tracking-tight">Overview</h1>
                <p className="text-sm font-bold text-[#1a2e22]/80 mt-1">Welcome back, {user.name.split(' ')[0]}. Let's make today a good day.</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center bg-white/40 border border-white/50 rounded-full px-4 py-2">
                    <Search className="w-4 h-4 text-[#1a2e22]/60 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Search games..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        className="bg-transparent border-none outline-none text-sm font-bold text-[#0f1912] placeholder-[#1a2e22]/50 w-32 focus:w-48 transition-all"
                    />
                </div>
                
                <button className="relative p-2 bg-white/40 border border-white/50 rounded-full hover:bg-white/60 transition-colors">
                    <Bell className="w-5 h-5 text-[#0f1912]" />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#8cb691]"></span>
                </button>

                {/* Changed to Chat Caretaker */}
                <button 
                    onClick={() => navigate('/dashboard/chat')}
                    className="flex items-center gap-2 bg-emerald-800 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Caretaker</span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/30">
                    <button 
                        onClick={() => navigate('/dashboard/profile')}
                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                    >
                        <div className="hidden sm:block">
                            <p className="text-sm font-extrabold text-[#0f1912]">{user.name}</p>
                            <p className="text-xs font-bold text-[#1a2e22]/70">{user.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-white border border-white/50 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                            {user.profilePicUrl ? (
                                <img src={user.profilePicUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-5 h-5 text-emerald-800" />
                            )}
                        </div>
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        className="ml-2 p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors border border-red-200"
                        title="Log out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}