import { createBaseService } from "./baseService";
import { supabaseAdmin } from "../lib/supabase";

const userService = createBaseService('users');


export const fetchUsers = (page, limit) => userService.getAll({ select: '* , rewards(*)', page, limit });

export const fetchUserById = (userId) => userService.getById(userId, { select: '* , rewards(*)' });

export const updateUser = (userId, updatedData) => userService.updateById(userId, updatedData);

/**
 * Delete a user from both the users table and Supabase authentication
 * @param {string} userId - The ID of the user to delete
 * @returns {Promise} - Result of the deletion
 */
export const deleteUser = async (userId) => {
    try {
        // First, get the user's auth_id (which should match their id in most cases)
        // The user's id in the users table should be their auth UID
        const user = await userService.getById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Delete from users table first
        const dbDeleteResult = await userService.deleteById(userId);

        if (dbDeleteResult instanceof Error) {
            throw dbDeleteResult;
        }

        // Delete from Supabase Auth
        // Note: This requires admin privileges. 
        // If using the anon key, you may need to use a service role key or create an Edge Function
        const { data: authDeleteData, error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authDeleteError) {
            console.error('Error deleting user from auth:', authDeleteError);
            console.warn('Database user was deleted but auth user deletion failed. Please ensure VITE_SUPABASE_SERVICE_ROLE_KEY is set in .env');
            // Note: Database user is already deleted, so we log this but don't throw
            // The user record is removed from the database, but the auth account may still exist
        } else {
            console.log('Successfully deleted user from both database and authentication');
        }

        return dbDeleteResult;
    } catch (error) {
        console.error('Error in deleteUser:', error);
        throw error;
    }
};
