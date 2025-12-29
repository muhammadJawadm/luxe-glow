import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('* , rewards(*)');
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data;
};

export const fetchUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('* , rewards(*)')
    .eq('id', userId);
  if (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
  return data;
}

export const updateUser = async (userId, updatedData) => {
  const { data, error } = await supabase
    .from('users')
    .update(updatedData)
    .eq('id', userId);
  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  return data;
}

export const deleteUser = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  if (error) {
    console.error('Error deleting user:', error);
    return null;
  }
  return data;
}