import { supabase } from '../lib/supabase';

/**
 * Login user with email and password
 * Verifies credentials against auth.users and checks if user is in admin_users table
 */
export const login = async (email, password) => {
    try {
        // Step 1: Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            throw new Error(authError.message);
        }

        if (!authData.user) {
            throw new Error('Authentication failed');
        }

        // Step 2: Check if user is in admin_users table
        const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', authData.user.id)
            .eq('is_active', true)
            .single();

        if (adminError || !adminData) {
            // User is not an admin or not active, sign them out
            await supabase.auth.signOut();
            throw new Error('Access denied. Only admin users can login to this system.');
        }

        // Step 3: Store admin user data in localStorage
        const adminUser = {
            id: authData.user.id,
            email: authData.user.email,
            role: adminData.role || 'admin',
            adminId: adminData.id,
            isActive: adminData.is_active,
        };

        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        localStorage.setItem('authToken', authData.session.access_token);

        return {
            success: true,
            user: adminUser,
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message || 'Login failed. Please try again.',
        };
    }
};

/**
 * Logout current user
 */
export const logout = async () => {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem('adminUser');
        localStorage.removeItem('authToken');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    const adminUser = localStorage.getItem('adminUser');
    const authToken = localStorage.getItem('authToken');
    return !!(adminUser && authToken);
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
        try {
            return JSON.parse(adminUser);
        } catch (error) {
            console.error('Error parsing admin user:', error);
            return null;
        }
    }
    return null;
};

/**
 * Verify session is still valid
 */
export const verifySession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            // Session is invalid, clear local storage
            localStorage.removeItem('adminUser');
            localStorage.removeItem('authToken');
            return false;
        }

        // Verify user is still in admin_users table
        const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('is_active', true)
            .single();

        if (adminError || !adminData) {
            // User is no longer an admin or not active
            await logout();
            return false;
        }

        return true;
    } catch (error) {
        console.error('Session verification error:', error);
        return false;
    }
};
