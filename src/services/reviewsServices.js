import { supabase } from "../lib/supabase";

export const fetchReviews = async()=>{
    const {data, error } = await supabase.from('reviews').select('*');
    if (error) {
        console.error('Error fetching reviews :', error);
        return null;
    }
    return data;
}

export const fetchReviewById = async(reviewId)=>{
    const {data, error } = await supabase.from('reviews').select('*').eq('id', reviewId);    
    if (error) {
        console.error('Error fetching review by ID:', error);
        return null;
    }
    return data;    
    }

export const updateReview = async(reviewId, updatedData)=>{
    const {data, error } = await supabase.from('reviews').update(updatedData).eq('id', reviewId);    
    if (error) {
        console.error('Error updating review:', error);
        return null;
    }
    return data;    
    }

export const deleteReview = async(reviewId)=>{
const {data, error} = await supabase.from('reviews').delete().eq('id', reviewId);
if (error) {
    console.error('Error deleting review:', error);
    return null;
}
return data;
}