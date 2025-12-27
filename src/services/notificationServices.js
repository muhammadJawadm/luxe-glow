import { supabase } from "../lib/supabase";

// Fetch all notifications with user details
export const fetchNotifications = async () => {
    const { data, error } = await supabase
        .from("notifications")
        .select(`
            *,
            users(id, name, email)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }

    return data;
};

// Fetch notifications by user ID (uid)
export const fetchNotificationsByUserId = async (userId) => {
    const { data, error } = await supabase
        .from("notifications")
        .select(`
            *,
            users(id, name, email)
        `)
        .eq("uid", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notifications by user ID:", error);
        throw error;
    }

    return data;
};

// Fetch notification by ID
export const fetchNotificationById = async (notificationId) => {
    const { data, error } = await supabase
        .from("notifications")
        .select(`
            *,
            users(id, name, email)
        `)
        .eq("id", notificationId)
        .single();

    if (error) {
        console.error("Error fetching notification by ID:", error);
        throw error;
    }

    return data;
};

// Create new notification
export const createNotification = async (notificationData) => {
    const { data, error } = await supabase
        .from("notifications")
        .insert([notificationData])
        .select(`
            *,
            users(id, name, email)
        `);

    if (error) {
        console.error("Error creating notification:", error);
        throw error;
    }

    return data;
};

// Create bulk notifications (send to multiple users)
export const createBulkNotifications = async (notificationsArray) => {
    const { data, error } = await supabase
        .from("notifications")
        .insert(notificationsArray)
        .select(`
            *,
            users(id, name, email)
        `);

    if (error) {
        console.error("Error creating bulk notifications:", error);
        throw error;
    }

    return data;
};

// Update notification
export const updateNotification = async (notificationId, updatedData) => {
    const { data, error } = await supabase
        .from("notifications")
        .update(updatedData)
        .eq("id", notificationId)
        .select(`
            *,
            users(id, name, email)
        `);

    if (error) {
        console.error("Error updating notification:", error);
        throw error;
    }

    return data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
    const { data, error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .select();

    if (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }

    return data;
};

// Delete notifications by user ID
export const deleteNotificationsByUserId = async (userId) => {
    const { data, error } = await supabase
        .from("notifications")
        .delete()
        .eq("uid", userId)
        .select();

    if (error) {
        console.error("Error deleting notifications by user ID:", error);
        throw error;
    }

    return data;
};

// Get notification count by user ID
export const getNotificationCountByUserId = async (userId) => {
    const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("uid", userId);

    if (error) {
        console.error("Error getting notification count:", error);
        throw error;
    }

    return count;
};

// Fetch recent notifications (limit)
export const fetchRecentNotifications = async (limit = 10) => {
    const { data, error } = await supabase
        .from("notifications")
        .select(`
            *,
            users(id, name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching recent notifications:", error);
        throw error;
    }

    return data;
};

// Fetch notifications by sender
export const fetchNotificationsBySender = async (sender) => {
    const { data, error } = await supabase
        .from("notifications")
        .select(`
            *,
            users(id, name, email)
        `)
        .eq("sender", sender)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notifications by sender:", error);
        throw error;
    }

    return data;
};

// Send push notification using Supabase Edge Function
export const sendPushNotification = async (notificationData) => {
    try {
        const { data, error } = await supabase.functions.invoke('send-notification', {
            body: {
                uid: notificationData.uid,
                title: notificationData.title,
                sub_title: notificationData.sub_title || null,
                image_url: notificationData.image_url || null,
                sender: notificationData.sender || 'system',
                // Additional data for the notification payload
                ...notificationData.additionalData
            }
        });

        if (error) {
            console.error("Error sending push notification:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error invoking send-notification function:", error);
        throw error;
    }
};

// Send bulk push notifications using Supabase Edge Function
export const sendBulkPushNotifications = async (notificationsArray) => {
    try {
        const results = [];

        for (const notification of notificationsArray) {
            try {
                const result = await sendPushNotification(notification);
                results.push({ success: true, data: result, uid: notification.uid });
            } catch (error) {
                results.push({ success: false, error: error.message, uid: notification.uid });
            }
        }

        return results;
    } catch (error) {
        console.error("Error sending bulk push notifications:", error);
        throw error;
    }
};

