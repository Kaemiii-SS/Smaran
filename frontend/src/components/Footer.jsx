import { Link } from 'react-router-dom';
import { Mail, Globe, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 pt-16 pb-8 border-t-2 border-emerald-900/30" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                
                <div className="flex flex-col items-center justify-center mb-12">
                    <Link to="/" title="Smaran Home" className="flex items-center gap-3 mb-8 group">
                        <span className="text-2xl font-extrabold text-emerald-800 tracking-tight">
                            Smaran
                        </span>
                    </Link>
                    
                    <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        <Link to="/#features" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700">Features</Link>
                        <Link to="/#caregivers" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700">Caregivers</Link>
                        <Link to="/#assessments" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700">Assessments</Link>
                        <Link to="/#safety" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700">Safety</Link>
                        <Link to="/#privacy" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700">Privacy</Link>
                        <Link to="/#terms" className="text-sm font-bold text-gray-800 transition-all duration-200 hover:text-emerald-700">Terms</Link>
                    </nav>
                </div>

                <div className="border-t-2 border-dashed border-gray-500 mb-8"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm font-bold text-gray-800">
                        © 2026 Dementia Care Platform
                    </p>
                    
                    <div className="flex items-center space-x-6">
                        <Link to="#" className="text-gray-900 transition-colors duration-200 hover:text-emerald-700">
                            <span className="sr-only">Website</span>
                            <Globe className="w-5 h-5" />
                        </Link>
                        
                        <Link to="#" className="text-gray-900 transition-colors duration-200 hover:text-emerald-700">
                            <span className="sr-only">Email</span>
                            <Mail className="w-5 h-5" />
                        </Link>

                        <Link to="#" className="text-gray-900 transition-colors duration-200 hover:text-emerald-700">
                            <span className="sr-only">Phone</span>
                            <Phone className="w-5 h-5" />
                        </Link>
                        
                        <Link to="#" className="text-gray-900 transition-colors duration-200 hover:text-emerald-700">
                            <span className="sr-only">Location</span>
                            <MapPin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
                
            </div>
        </footer>
    );
}