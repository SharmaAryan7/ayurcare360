import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';

const ProtectedRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const [authState, setAuthState] = useState({ isLoading: true, role: null, isAuthenticated: false });

    useEffect(() => {
        const verifySession = async () => {
            try {
                // authApi already unwraps axios response.data
                // Backend returns: { user: { id: 1, role: 'patient' } }
                const data = await authApi.checkAuth();

                setAuthState({
                    isLoading: false,
                    role: data.user.role, // FIX: Extract role from the 'user' object
                    isAuthenticated: true
                });
            } catch (error) {
                setAuthState({ isLoading: false, role: null, isAuthenticated: false });
            }
        };
        verifySession();
    }, []);

    if (authState.isLoading) {
        // Prevent flashing unauthorized content with a nice spinner
        return (
            <div className="flex h-screen items-center justify-center bg-[#FAF7F2]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A6447]"></div>
            </div>
        );
    }

    if (!authState.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(authState.role)) {
        // Redirect to home if they are logged in but lack permissions for this specific route
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;