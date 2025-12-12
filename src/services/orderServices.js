import { supabase } from "../lib/supabase";


export const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*, users(*), payments(*)');
    if (error) {
        console.error('Error fetching orders:', error);
    }
    return data;
}

export const fetchOrderById = async (orderId) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId);
    if (error) {
        console.error('Error fetching order by ID:', error);
        return null;
    }
    return data;

}

export const deleteOrder = async (orderId) => {
    const { data, error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) {
        console.error('Error deleting order:', error);
        return null;
    }
    return data;
}