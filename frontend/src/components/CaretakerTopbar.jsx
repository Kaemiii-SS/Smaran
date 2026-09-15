import { Bell, User as UserIcon, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CaretakerTopbar() {
    const [user, setUser] = useState({ name: 'Guest', role: 'Caretaker', username: 'guest' });
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
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
                <h1 className="text-3xl font-extrabold text-[#0f1912] tracking-tight">Caretaker Dashboard</h1>
                <p className="text-sm font-bold text-[#1a2e22]/80 mt-1">Hello, {user.name}. Manage and monitor your patients here.</p>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 bg-white/40 border border-white/50 rounded-full hover:bg-white/60 transition-colors">
                    <Bell className="w-5 h-5 text-[#0f1912]" />
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
                        <div className="w-10 h-10 bg-emerald-800 border border-emerald-900 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                            {user.profilePicUrl ? (
                                <img src={user.profilePicUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-5 h-5 text-white" />
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
