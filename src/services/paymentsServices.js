import { supabase } from "../lib/supabase";

export const fetchPayments = async () => {
    const { data, error } = await supabase.from('payments').select('*, users(*)');
    if (error) {
        console.error('Error fetching payments:', error);
        return null;
    }
    return data;
}

export const fetchPaymentById = async (paymentId) => {
    const { data, error } = await supabase.from('payments').select('*').eq('id', paymentId);
    if (error) {
        console.error('Error fetching payment by ID:', error);
        return null;
    }
    return data;
}

export const updatePayment = async (paymentId, updatedData) => {
    const { data, error } = await supabase.from('payments').update(updatedData).eq('id', paymentId);
    if (error) {
        console.error('Error updating payment:', error);
        return null;
    }
    return data;
}

export const deleteCategory = async (categoryId) => {
    const { data, error } = await supabase.from('payments').delete().eq('id', paymentId);
    if (error) {
        console.error('Error deleting payment:', error);
        return null;
    }
    return data;
}