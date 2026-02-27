import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

import { MediaRecord, useUploadMedia } from './use-upload-media';
import { useApiFetchClient } from '@/kernel/api/provider';

export function useUploadAvatar({ onSuccess }: { onSuccess: (media: MediaRecord) => void }) {
  const fetchClient = useApiFetchClient();

  const { upload, isUploading, progress, data, error, reset } = useUploadMedia({
    fetchUploadUrl: async (mimeType) =>
      fetchClient
        .POST('/media/avatar/upload-request', {
          body: {
            contentType: mimeType,
          },
        })
        .then((response) => {
          if (response.error) throw response.error;
          return response.data;
        }),
    onSuccess,
  });

  const pickAndUpload = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      throw new Error('Permission to access gallery is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    if (!asset.uri) {
      throw new Error('No image selected');
    }

    // Определяем MIME-тип на основе расширения файла
    let mimeType = asset.mimeType;
    if (!mimeType) {
      const uri = asset.uri.toLowerCase();
      if (uri.endsWith('.png')) {
        mimeType = 'image/png';
      } else if (uri.endsWith('.jpg') || uri.endsWith('.jpeg')) {
        mimeType = 'image/jpeg';
      } else if (uri.endsWith('.webp')) {
        mimeType = 'image/webp';
      } else {
        mimeType = 'image/jpeg'; // default
      }
    }

    const response = await fetch(asset.uri);
    const blob = await response.blob();

    // Создаём новый Blob с правильным MIME-типом
    const typedBlob = new Blob([blob], { type: mimeType });

    return new Promise<string>((resolve, reject) => {
      upload(
        { file: typedBlob, contentType: mimeType },
        {
          onSuccess: (uploadResult) => {
            resolve(uploadResult.mediaId);
          },
          onError: (uploadError) => {
            reject(uploadError);
          },
        },
      );
    });
  }, [upload]);

  return {
    pickAndUpload,
    isUploading,
    progress,
    uploadedMediaId: data?.mediaId,
    error,
    reset,
  };
}
