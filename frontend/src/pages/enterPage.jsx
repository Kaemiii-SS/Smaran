import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, checkAuth, logoutUser } from '../store/authSlice';

const EnterPage = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);
    
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'Patient'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            dispatch(loginUser({ email: formData.email, password: formData.password }));
        } else {
            dispatch(registerUser(formData));
        }
    };

    const handleCheckAuth = () => {
        dispatch(checkAuth());
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    if (isAuthenticated && user) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-cyan-500/10 hover:border-slate-600">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-6">
                        Welcome, {user.name || user.username}!
                    </h2>
                    
                    <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 mb-8 space-y-3">
                        <p className="text-slate-400 text-sm flex justify-between">
                            <span>ID:</span> <strong className="text-slate-200 font-mono">{user.id}</strong>
                        </p>
                        <p className="text-slate-400 text-sm flex justify-between">
                            <span>Email:</span> <strong className="text-slate-200">{user.email}</strong>
                        </p>
                        <p className="text-slate-400 text-sm flex justify-between">
                            <span>Role:</span> <strong className="text-slate-200 uppercase tracking-wider text-xs bg-slate-800 px-2 py-1 rounded">{user.role}</strong>
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <button 
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none" 
                            onClick={handleCheckAuth} 
                            disabled={loading}
                        >
                            {loading ? 'Checking...' : 'Test Check Auth'}
                        </button>
                        <button 
                            className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none" 
                            onClick={handleLogout} 
                            disabled={loading}
                        >
                            Logout
                        </button>
                    </div>
                    {error && (
                        <div className="mt-6 p-4 bg-red-950/50 border border-red-900/50 text-red-400 text-sm rounded-xl">
                            {error.error || error.message}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-blue-500/5 hover:border-slate-600">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-slate-400">
                        {isLogin ? 'Enter your credentials to access your account' : 'Sign up to get started'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-950/50 border border-red-900/50 text-red-400 text-sm rounded-xl">
                        {error.error || error.message || 'An error occurred'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                                <input 
                                    type="text" name="username" value={formData.username} onChange={handleChange} required 
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all"
                                    placeholder="johndoe"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 ml-1">Name</label>
                                <input 
                                    type="text" name="name" value={formData.name} onChange={handleChange} required 
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 ml-1">Role</label>
                                <select
                                    name="role" value={formData.role} onChange={handleChange} required
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 outline-none transition-all cursor-pointer"
                                >
                                    <option value="Patient">Patient</option>
                                    <option value="Caretaker">Caretaker</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                        <input 
                            type="email" name="email" value={formData.email} onChange={handleChange} required 
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <input 
                            type="password" name="password" value={formData.password} onChange={handleChange} required 
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 placeholder-slate-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            type="button"
                            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors focus:outline-none" 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EnterPage;