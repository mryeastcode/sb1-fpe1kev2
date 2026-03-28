import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export function useImageUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraStatus === 'granted' && mediaStatus === 'granted';
  };

  // Pick image from gallery
  const pickImage = async (): Promise<string | null> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setError('Permission denied');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) return null;
    return result.assets[0].uri;
  };

  // Take photo with camera
  const takePhoto = async (): Promise<string | null> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setError('Permission denied');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) return null;
    return result.assets[0].uri;
  };

  // Upload image to Supabase Storage
  const uploadImage = async (uri: string): Promise<UploadResult> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    setUploading(true);
    setError(null);

    try {
      // Get file extension
      const extension = uri.split('.').pop() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${extension}`;
      
      // Fetch the image and convert to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('meal-photos')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: `image/${extension}`,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('meal-photos')
        .getPublicUrl(fileName);

      return { success: true, url: publicUrl };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  };

  // Delete image from storage
  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      // Extract file path from URL
      const path = url.split('/meal-photos/')[1];
      if (!path) return false;

      const { error: deleteError } = await supabase.storage
        .from('meal-photos')
        .remove([path]);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    uploading,
    error,
    requestPermissions,
    pickImage,
    takePhoto,
    uploadImage,
    deleteImage,
  };
}