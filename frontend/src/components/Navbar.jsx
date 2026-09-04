import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="absolute inset-x-0 top-0 z-50" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex items-center justify-between h-24">
                    <div className="flex-shrink-0">
                        <Link to="/" title="Smaran Home" className="flex text-2xl font-extrabold text-emerald-800 tracking-tight">
                            Smaran
                        </Link>
                    </div>

                    <button type="button" className="inline-flex p-2 text-gray-900 transition-all duration-200 rounded-md lg:hidden focus:bg-white/50 hover:bg-white/50">
                        <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                        </svg>
                    </button>

                    <div className="hidden lg:flex lg:items-center lg:justify-center bg-white/60 backdrop-blur-md border border-white/20 shadow-sm rounded-full px-8 py-3 space-x-8">
                        <Link to="/#features" title="Patient Features" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700"> Features </Link>
                        <Link to="/#dashboard" title="Caregiver Dashboard" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700"> Caregiver Dashboard </Link>
                        <Link to="/#assessments" title="Cognitive Assessment" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700"> Assessments </Link>
                        <Link to="/#safety" title="Safety & Privacy" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700"> Safety </Link>
                    </div>

                    <div className="hidden lg:flex lg:items-center lg:space-x-4">
                        <Link to="/login" title="Sign in" className="text-sm font-bold text-gray-900 transition-all duration-200 hover:text-emerald-700 px-4 py-2.5"> 
                            Sign in 
                        </Link>
                        <Link to="/register" title="Get started" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-md shadow-gray-900/20" role="button"> 
                            Get started 
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}