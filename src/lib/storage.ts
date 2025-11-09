import { supabase } from './supabase';

export const uploadImage = async (file: File, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getImageUrl = (path: string) => {
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const deleteImage = async (path: string) => {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};