import { supabase } from '../lib/supabase';
import { createBaseService } from "./baseService";
const rewardsService = createBaseService('rewards');

export const fetchAllRewards = async () => rewardsService.getAll({
    select: `*, users(*)`,
    orderBy: "stars"
})

export const fetchRewards = async (id) => rewardsService.getAll({
    select: `*, users(*)`,
    filter: { uid: id }
})

export const getRewardsStatistics = async () => {
    const rewards = await rewardsService.getAll({ select: 'stars' });

    if (!rewards) {
        console.error('Error fetching rewards statistics:', error);
    }

    const totalUsers = rewards?.length || 0;
    const totalStars = rewards?.reduce((sum, reward) => sum + reward.stars, 0) || 0;
    const averageStars = totalUsers > 0 ? (totalStars / totalUsers).toFixed(1) : 0;

    return {
        totalUsers,
        totalStars,
        averageStars
    };
};

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
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in updateUserRewards:', error);
        return { success: false, error: error.message };
    }
};
