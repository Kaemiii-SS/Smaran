import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import CaretakerDashboard from './CaretakerDashboard';
import { Loader2 } from 'lucide-react';

export default function RoleBasedDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userString && token) {
            setUser(JSON.parse(userString));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#8cb691]">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'Caretaker') {
        return <CaretakerDashboard />;
    }

    // Default to Patient Dashboard
    return <Dashboard />;
}
