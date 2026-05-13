import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import { openFileChunkReader } from './file-ops';
import { useApiFetchClient } from '@/kernel/api/provider';

type FetchClient = ReturnType<typeof useApiFetchClient>;

interface UploadVideoResult {
  mediaId: string;
}

export interface UseUploadVideoOptions {
  name: string;
  maxSizeMb?: number;
  partConcurrency?: number;
}

export function useUploadVideo(options: UseUploadVideoOptions) {
  const { name, maxSizeMb = 500, partConcurrency = 2 } = options;
  const fetchClient = useApiFetchClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (input: { fileUri: string; mimeType: string; fileSize: number }) =>
      performVideoUpload({
        ...input,
        name,
        partConcurrency,
        fetchClient,
        onProgress: setProgress,
      }),
    onError: () => setProgress(0),
  });

  const pickAndUpload = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Нет доступа к галерее');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 1,
    });

    if (result.canceled) return null;

    const asset = result.assets[0];
    if (!asset.uri) throw new Error('Не удалось получить файл');

    const mimeType = asset.mimeType ?? 'video/mp4';

    const fileSize = asset.fileSize ?? 0;
    if (!fileSize) throw new Error('Не удалось определить размер файла');

    const maxFileSize = maxSizeMb * 1024 * 1024;
    if (fileSize > maxFileSize) {
      throw new Error(`Файл слишком большой. Максимальный размер — ${maxSizeMb} МБ`);
    }

    const uploaded = await mutation.mutateAsync({ fileUri: asset.uri, mimeType, fileSize });
    return uploaded.mediaId;
  }, [mutation.mutateAsync, maxSizeMb]);

  return {
    pickAndUpload,
    isUploading: mutation.isPending,
    progress,
    uploadedMediaId: mutation.data?.mediaId,
    error: mutation.error,
    reset: () => {
      setProgress(0);
      mutation.reset();
    },
  };
}

async function performVideoUpload(params: {
  fileUri: string;
  mimeType: string;
  fileSize: number;
  name: string;
  partConcurrency: number;
  fetchClient: FetchClient;
  onProgress: (progress: number) => void;
}): Promise<UploadVideoResult> {
  const { fileUri, mimeType, fileSize, name, partConcurrency, fetchClient, onProgress } = params;
  onProgress(0);

  const { data: initData, error: initError } = await fetchClient.POST('/media/video/upload-init', {
    body: { name, mimeType, fileSize },
  });
  if (initError) throw initError;

  const { mediaId, uploadId, partUrls } = initData;
  const partSize = Math.ceil(fileSize / partUrls.length);
  const partProgresses = new Array<number>(partUrls.length).fill(0);
  const updateProgress = () => {
    const total = partProgresses.reduce((sum, p) => sum + p, 0) / partUrls.length;
    onProgress(Math.round(total));
  };

  const reader = await openFileChunkReader(fileUri);
  try {
    const uploadTasks = partUrls.map((url, i) => async () => {
      const start = i * partSize;
      const length = Math.min(start + partSize, fileSize) - start;
      const bytes = await reader.readChunk(start, length);
      const etag = await uploadPart(url, bytes, (partProgress) => {
        partProgresses[i] = partProgress;
        updateProgress();
      });
      return { partNumber: i + 1, etag };
    });

    const parts = await runWithConcurrency(uploadTasks, partConcurrency);

    const { error: completeError } = await fetchClient.POST('/media/video/upload-complete', {
      body: { mediaId, uploadId, parts },
    });
    if (completeError) throw completeError;

    onProgress(100);
    return { mediaId };
  } finally {
    reader.close();
  }
}

async function runWithConcurrency<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    if (nextIndex >= tasks.length) return;
    const index = nextIndex++;
    results[index] = await tasks[index]();
    return worker();
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
  return results;
}

async function uploadPart(
  url: string,
  bytes: Uint8Array,
  onProgress: (progress: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress((event.loaded / event.total) * 100);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const etag = xhr.getResponseHeader('ETag');
        if (!etag) {
          reject(new Error('Missing ETag in upload response'));
          return;
        }
        resolve(etag);
      } else {
        reject(new Error(`Part upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Part upload failed')));
    xhr.addEventListener('abort', () => reject(new Error('Part upload aborted')));

    xhr.open('PUT', url);
    xhr.send(bytes);
  });
}
