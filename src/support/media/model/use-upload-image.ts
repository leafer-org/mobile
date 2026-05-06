import { useMutation } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import { useApiFetchClient } from '@/kernel/api/provider';

export interface UploadImageResult {
  fileId: string;
  width: number | null;
  height: number | null;
  mimeType: string | null;
}

export interface UseUploadImageOptions {
  name: string;
  maxSizeMb?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

export function useUploadImage(options: UseUploadImageOptions) {
  const { name, maxSizeMb = 20, allowsEditing, aspect, quality = 0.8 } = options;
  const fetchClient = useApiFetchClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (input: {
      fileUri: string;
      mimeType: string;
    }): Promise<UploadImageResult> => {
      const { data: requestResult, error: requestError } = await fetchClient.POST(
        '/media/image/upload-request',
        { body: { name, mimeType: input.mimeType } },
      );
      if (requestError) throw requestError;

      await uploadFileToS3({
        fileUri: input.fileUri,
        mimeType: input.mimeType,
        uploadUrl: requestResult.uploadUrl,
        uploadFields: requestResult.uploadFields,
        onProgress: setProgress,
      });

      const { data: completeResult, error: completeError } = await fetchClient.POST(
        '/media/image/upload-complete',
        { body: { mediaId: requestResult.fileId } },
      );
      if (completeError) throw completeError;

      return {
        fileId: requestResult.fileId,
        width: completeResult.width ?? null,
        height: completeResult.height ?? null,
        mimeType: completeResult.mimeType ?? null,
      };
    },
    onSuccess: () => setProgress(100),
    onError: () => setProgress(0),
  });

  const pickAndUpload = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Нет доступа к галерее');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing,
      aspect,
      quality,
    });

    if (result.canceled) return null;

    const asset = result.assets[0];
    if (!asset.uri) throw new Error('Не удалось получить файл');

    const mimeType = resolveImageMimeType(asset.uri, asset.mimeType);

    const info = await FileSystem.getInfoAsync(asset.uri);
    const fileSize = info.exists ? info.size : 0;

    const maxFileSize = maxSizeMb * 1024 * 1024;
    if (fileSize > maxFileSize) {
      throw new Error(`Файл слишком большой. Максимальный размер — ${maxSizeMb} МБ`);
    }

    const uploaded = await mutation.mutateAsync({ fileUri: asset.uri, mimeType });
    return uploaded.fileId;
  }, [mutation.mutateAsync, allowsEditing, aspect, quality, maxSizeMb]);

  return {
    pickAndUpload,
    isUploading: mutation.isPending,
    progress,
    uploadedFileId: mutation.data?.fileId,
    error: mutation.error,
    reset: () => {
      setProgress(0);
      mutation.reset();
    },
  };
}

function resolveImageMimeType(uri: string, mimeType?: string | null): string {
  if (mimeType) return mimeType;
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

async function uploadFileToS3(params: {
  fileUri: string;
  mimeType: string;
  uploadUrl: string;
  uploadFields: Record<string, string>;
  onProgress?: (progress: number) => void;
}): Promise<void> {
  const task = FileSystem.createUploadTask(
    params.uploadUrl,
    params.fileUri,
    {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      parameters: params.uploadFields,
      mimeType: params.mimeType,
    },
    (data) => {
      if (data.totalBytesExpectedToSend > 0) {
        params.onProgress?.((data.totalBytesSent / data.totalBytesExpectedToSend) * 100);
      }
    },
  );

  const response = await task.uploadAsync();
  if (!response) throw new Error('Upload was cancelled');
  if (response.status < 200 || response.status >= 300) {
    const message = parseS3Error(response.body) ?? `Upload failed with status ${response.status}`;
    throw new Error(message);
  }
}

const S3_ERROR_MESSAGES: Record<string, string> = {
  EntityTooLarge: 'Файл слишком большой',
  AccessDenied: 'Нет доступа для загрузки',
};

function parseS3Error(responseText: string): string | null {
  const codeMatch = responseText.match(/<Code>(\w+)<\/Code>/);
  if (!codeMatch) return null;
  return S3_ERROR_MESSAGES[codeMatch[1]] ?? null;
}
