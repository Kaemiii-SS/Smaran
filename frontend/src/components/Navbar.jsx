import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-slate-900/80 border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                            Smaran
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <span className="text-slate-300 text-sm hidden sm:block">
                                    Welcome, <span className="font-semibold text-white">{user?.name || user?.username}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-all duration-300 ease-in-out"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/"
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/30"
                            >
                                Get Started
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
