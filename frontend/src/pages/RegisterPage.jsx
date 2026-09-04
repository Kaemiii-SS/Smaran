import { useState } from 'react';
import { Mail, Lock, User, AtSign, ArrowRight, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import registerImg from '../assets/register.png';

export default function Register() {
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'Patient'
    });
    
    // Status state
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Send data to your Express backend using the environment variable
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error || 
                                     (data.errors && data.errors[0]?.message) || 
                                     'Registration failed. Please try again.';
                throw new Error(errorMessage);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#8cb691]">
            
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <svg 
                    className="absolute top-0 left-0 w-full h-full object-cover" 
                    preserveAspectRatio="xMidYMin slice" 
                    viewBox="0 0 1440 800" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="paper-shadow-register" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#2a402d" floodOpacity="0.12" />
                        </filter>
                    </defs>
                    
                    <path d="M0,0 V650 C200,600 350,800 550,650 C750,500 800,250 1050,350 C1300,450 1350,700 1440,600 V0 Z" fill="#9bc1a0" filter="url(#paper-shadow-register)" />
                    <path d="M0,0 V450 C150,500 350,300 550,400 C750,500 850,800 1100,650 C1300,530 1350,350 1440,450 V0 Z" fill="#b0cfb4" filter="url(#paper-shadow-register)" />
                    <path d="M0,0 V250 C200,350 400,150 600,250 C800,350 950,600 1200,450 C1350,350 1400,200 1440,300 V0 Z" fill="#cbe5cf" filter="url(#paper-shadow-register)" />
                    <path d="M0,0 V100 C250,170 350,70 650,140 C950,210 1050,400 1250,280 C1400,190 1420,120 1440,170 V0 Z" fill="#e3f2e6" filter="url(#paper-shadow-register)" />
                </svg>
            </div>

            <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col-reverse lg:flex-row min-h-[500px]">
                    
                    <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white/60 to-white/30">
                        <div className="max-w-sm mx-auto w-full">
                            
                            <div className="text-center lg:text-left mb-6">
                                <h2 className="text-3xl font-extrabold text-[#0f1912] mb-2" style={{ fontFamily: "'Courier New', Courier, monospace", letterSpacing: "-0.02em" }}>
                                    Create Account
                                </h2>
                                <p className="text-sm font-bold text-[#1a2e22]/80" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                    Join Smaran to start your cognitive care journey.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm font-semibold">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-extrabold text-[#0f1912]" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-[#1a2e22]/50" />
                                        </div>
                                        <input 
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe" 
                                            className="w-full pl-11 pr-4 py-3 bg-white/70 border border-white/80 rounded-2xl text-[#0f1912] font-semibold placeholder-[#1a2e22]/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:bg-white transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-extrabold text-[#0f1912]" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <AtSign className="h-5 w-5 text-[#1a2e22]/50" />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="johndoe123" 
                                            className="w-full pl-11 pr-4 py-3 bg-white/70 border border-white/80 rounded-2xl text-[#0f1912] font-semibold placeholder-[#1a2e22]/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:bg-white transition-all shadow-sm"
                                            required
                                            minLength={3}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-extrabold text-[#0f1912]" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-[#1a2e22]/50" />
                                        </div>
                                        <input 
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com" 
                                            className="w-full pl-11 pr-4 py-3 bg-white/70 border border-white/80 rounded-2xl text-[#0f1912] font-semibold placeholder-[#1a2e22]/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:bg-white transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-extrabold text-[#0f1912]" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                        Role
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Shield className="h-5 w-5 text-[#1a2e22]/50" />
                                        </div>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-white/70 border border-white/80 rounded-2xl text-[#0f1912] font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:bg-white transition-all shadow-sm appearance-none"
                                            required
                                        >
                                            <option value="Patient">Patient</option>
                                            <option value="Caretaker">Caretaker</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-extrabold text-[#0f1912]" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-[#1a2e22]/50" />
                                        </div>
                                        <input 
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••" 
                                            className="w-full pl-11 pr-4 py-3 bg-white/70 border border-white/80 rounded-2xl text-[#0f1912] font-semibold placeholder-[#1a2e22]/40 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:bg-white transition-all shadow-sm"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={`group w-full flex items-center justify-center px-8 py-3.5 mt-4 text-sm font-bold text-white transition-all duration-200 bg-[#0f1912] border border-transparent rounded-2xl shadow-xl shadow-[#0f1912]/20 
                                    ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f1912]'}`}
                                >
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                    {!loading && <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm font-bold text-[#1a2e22]/80" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-emerald-800 font-extrabold hover:text-emerald-600 transition-colors underline decoration-2 underline-offset-4">
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 bg-[#7a9f7e]/20 flex items-center justify-center p-8 lg:p-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-60"></div>
                        <img 
                            src={registerImg} 
                            alt="Sign Up Illustration" 
                            className="w-full max-w-[320px] object-contain relative z-10 rounded-2xl drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}