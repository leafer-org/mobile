import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import type { components } from '@/kernel/api/schema';

export interface UploadMediaInput {
  file: File | Blob;
  contentType: string;
  onProgress?: (progress: number) => void;
}

export type MediaRecord = components['schemas']['LinkMediaData'];

export interface UseUploadMediaOptions {
  fetchUploadUrl: (mimeType: string) => Promise<MediaRecord & { url: string }>;
  onSuccess?: (result: MediaRecord) => void;
  onError?: (error: Error) => void;
}

export function useUploadMedia(options: UseUploadMediaOptions) {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (input: UploadMediaInput): Promise<MediaRecord> => {
      const { url, ...mediaRecord } = await options.fetchUploadUrl(input.contentType);

      await uploadToS3({
        file: input.file,
        uploadUrl: url,
        onProgress: (p) => {
          setProgress(p);
          input.onProgress?.(p);
        },
      });

      return mediaRecord;
    },
    onSuccess: (data) => {
      setProgress(100);
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      setProgress(0);
      options.onError?.(error);
    },
  });

  return {
    upload: mutation.mutate,
    uploadAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    progress,
    error: mutation.error,
    data: mutation.data,
    reset: () => {
      setProgress(0);
      mutation.reset();
    },
  };
}

async function uploadToS3(params: {
  file: File | Blob;
  uploadUrl: string;
  onProgress?: (progress: number) => void;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        params.onProgress?.(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    xhr.open('PUT', params.uploadUrl);
    xhr.setRequestHeader('Content-Type', params.file.type || 'application/octet-stream');
    xhr.send(params.file);
  });
}
