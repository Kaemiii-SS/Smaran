import { Navigate, Outlet } from 'react-router-dom';

export default function AuthRoute() {
    const token = localStorage.getItem('token');
    
    // If user is already logged in, they shouldn't see login/register pages
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return <Outlet />;
}
