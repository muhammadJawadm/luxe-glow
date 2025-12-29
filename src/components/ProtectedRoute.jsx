import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, verifySession } from '../services/authService';

/**
 * ProtectedRoute component that wraps protected pages
 * Checks authentication and redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            // First check if basic auth exists
            if (!isAuthenticated()) {
                setIsAuth(false);
                setIsChecking(false);
                return;
            }

            // Then verify session is still valid
            const isValid = await verifySession();
            setIsAuth(isValid);
            setIsChecking(false);
        };

        checkAuth();
    }, []);

    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User is authenticated, render the protected content
    return children;
};

export default ProtectedRoute;
