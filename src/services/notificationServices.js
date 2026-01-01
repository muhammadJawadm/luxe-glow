import { supabase } from "../lib/supabase";

import { createBaseService } from "./baseService";

const notificationService = createBaseService('notifications')

export const fetchNotifications = async () => notificationService.getAll({
    select: `*,users (*)`,
    orderBy: 'created_at',
    ascending: false
})

export const fetchNotificationsByUserId = async (userId) => notificationService.getAll({
    select: `*,users (*)`,
    filter: { uid: userId },
    orderBy: 'created_at',
    ascending: false
})

export const fetchNotificationById = async (notificationId) => notificationService.getById(notificationId)

export const createNotification = async (notificationData, select = "*,users(*)") => notificationService.create(notificationData, select)

export const updateNotification = async (notificationId, updatedData) => notificationService.updateById(notificationId, updatedData)

export const deleteNotification = async (notificationId) => notificationService.deleteById(notificationId)

export const fetchNotificationsBySender = async (sender) => notificationService.getAll({
    select: `*,users(*)`,
    filter: { sender: sender },
    orderBy: "created_at",
    ascending: false
})

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

