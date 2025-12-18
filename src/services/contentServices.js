import { supabase } from '../lib/supabase';

/**
 * Fetch content by type (privacy or terms)
 */
export const fetchContentByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${type} content:`, error);
      throw error;
    }

    // Return the first item if exists, otherwise null
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching ${type} content:`, error);
    // Return null if error (no content exists yet)
    return null;
  }
};

/**
 * Update existing content
 */
export const updateContent = async (id, description) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .update({ description })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating content:', error);
      throw error;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

/**
 * Create new content
 */
export const createContent = async (type, description) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .insert([{ type, description }])
      .select();

    if (error) {
      console.error('Error creating content:', error);
      throw error;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

/**
 * Save content (update if exists, create if not)
 */
export const saveContent = async (type, description, existingId) => {
  try {
    if (existingId) {
      return await updateContent(existingId, description);
    } else {
      return await createContent(type, description);
    }
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
};