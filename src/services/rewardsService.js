import { supabase } from '../lib/supabase';

/**
 * Fetch all rewards with user details
 * Joins rewards with users table
 */
export const fetchAllRewards = async () => {
    try {
        const { data, error } = await supabase
            .from('rewards')
            .select(`
        *,
        users(*)
      `)
            .order('stars', { ascending: false });

        if (error) {
            console.error('Error fetching rewards:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchAllRewards:', error);
        return [];
    }
};

export const fetchRewards = async (id) => {
    try {
        const { data, error } = await supabase
            .from('rewards')
            .select(`
        *
      `)
            .eq('uid', id)
            .single();

        if (error) {
            console.error('Error fetching rewards:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchRewards:', error);
        return [];
    }
};



/**
 * Update user rewards (stars)
 * Uses upsert to create or update
 */
export const updateUserRewards = async (uid, stars) => {
    try {
        const { data, error } = await supabase
            .from('rewards')
            .upsert(
                {
                    uid: uid,
                    stars: stars,
                    last_updated: new Date().toISOString()
                },
                {
                    onConflict: 'uid'
                }
            )
            .select();

        if (error) {
            console.error('Error updating rewards:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in updateUserRewards:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get rewards statistics
 */
export const getRewardsStatistics = async () => {
    try {
        const { data, error } = await supabase
            .from('rewards')
            .select('stars');

        if (error) {
            console.error('Error fetching rewards statistics:', error);
            return {
                totalUsers: 0,
                totalStars: 0,
                averageStars: 0
            };
        }

        const totalUsers = data?.length || 0;
        const totalStars = data?.reduce((sum, reward) => sum + reward.stars, 0) || 0;
        const averageStars = totalUsers > 0 ? (totalStars / totalUsers).toFixed(1) : 0;

        return {
            totalUsers,
            totalStars,
            averageStars
        };
    } catch (error) {
        console.error('Error in getRewardsStatistics:', error);
        return {
            totalUsers: 0,
            totalStars: 0,
            averageStars: 0
        };
    }
};

/**
 * Delete user rewards
 */
export const deleteUserRewards = async (uid) => {
    try {
        const { data, error } = await supabase
            .from('rewards')
            .delete()
            .eq('uid', uid);

        if (error) {
            console.error('Error deleting rewards:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in deleteUserRewards:', error);
        return { success: false, error: error.message };
    }
};
