import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import { uploadMultipart } from './file-ops';
import { useApiFetchClient } from '@/kernel/api/provider';

type FetchClient = ReturnType<typeof useApiFetchClient>;

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
    mutationFn: (input: { fileUri: string; mimeType: string }) =>
      performImageUpload({ ...input, name, fetchClient, onProgress: setProgress }),
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

    const fileSize = asset.fileSize ?? 0;
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

async function performImageUpload(params: {
  fileUri: string;
  mimeType: string;
  name: string;
  fetchClient: FetchClient;
  onProgress: (progress: number) => void;
}): Promise<UploadImageResult> {
  const { fileUri, mimeType, name, fetchClient, onProgress } = params;

  const { data: requestResult, error: requestError } = await fetchClient.POST(
    '/media/image/upload-request',
    { body: { name, mimeType } },
  );
  if (requestError) throw requestError;

  const response = await uploadMultipart({
    url: requestResult.uploadUrl,
    fileUri,
    mimeType,
    fields: requestResult.uploadFields,
    onProgress,
  });

  if (response.status < 200 || response.status >= 300) {
    const message = parseS3Error(response.body) ?? `Upload failed with status ${response.status}`;
    throw new Error(message);
  }

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
}

function resolveImageMimeType(uri: string, mimeType?: string | null): string {
  if (mimeType) return mimeType;
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
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
