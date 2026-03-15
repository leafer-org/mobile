import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

import { useUploadMedia } from './use-upload-media';
import { useApiFetchClient } from '@/kernel/api/provider';

export function useUploadAvatar() {
  const fetchClient = useApiFetchClient();

  const { upload, isUploading, progress, data, error, reset } = useUploadMedia({
    fetchUploadUrl: async (mimeType) => {
      const { data: result, error: apiError } = await fetchClient.POST('/media/upload-request', {
        body: { name: 'avatar', mimeType },
      });
      if (apiError) throw apiError;
      return result;
    },
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

    if (result.canceled) return null;

    const asset = result.assets[0];
    if (!asset.uri) throw new Error('No image selected');

    const mimeType = resolveMimeType(asset.uri, asset.mimeType);

    const response = await fetch(asset.uri);
    const blob = await response.blob();

    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (blob.size > MAX_FILE_SIZE) {
      throw new Error('Файл слишком большой. Максимальный размер — 20 МБ');
    }

    const typedBlob = new Blob([blob], { type: mimeType });

    return new Promise<string>((resolve, reject) => {
      upload(
        { file: typedBlob, contentType: mimeType },
        {
          onSuccess: (uploadResult) => resolve(uploadResult.fileId),
          onError: (uploadError) => reject(uploadError),
        },
      );
    });
  }, [upload]);

  return {
    pickAndUpload,
    isUploading,
    progress,
    uploadedFileId: data?.fileId,
    error,
    reset,
  };
}

function resolveMimeType(uri: string, mimeType?: string | null): string {
  if (mimeType) return mimeType;

  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}
