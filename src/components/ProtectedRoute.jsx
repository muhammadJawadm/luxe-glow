import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, verifySession, getCurrentUser } from '../services/authService';

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

/**
 * RoleProtectedRoute - renders children only if the user's role is in allowedRoles.
 * POS users are redirected to /pos/sell; others to /login.
 * Must be used inside ProtectedRoute (authentication is already verified).
 */
export const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const user = getCurrentUser();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // POS users get redirected to their allowed page
        return <Navigate to="/pos/sell" replace />;
    }

    return children;
};

export default ProtectedRoute;
