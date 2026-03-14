import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export interface UploadMediaInput {
  file: File | Blob;
  contentType: string;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  fileId: string;
}

interface PresignedPost {
  fileId: string;
  uploadUrl: string;
  uploadFields: Record<string, string>;
}

export interface UseUploadMediaOptions {
  fetchUploadUrl: (mimeType: string) => Promise<PresignedPost>;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

export function useUploadMedia(options: UseUploadMediaOptions) {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (input: UploadMediaInput): Promise<UploadResult> => {
      const { fileId, uploadUrl, uploadFields } = await options.fetchUploadUrl(input.contentType);

      await uploadToS3({
        file: input.file,
        uploadUrl,
        uploadFields,
        onProgress: (p) => {
          setProgress(p);
          input.onProgress?.(p);
        },
      });

      return { fileId };
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
  uploadFields: Record<string, string>;
  onProgress?: (progress: number) => void;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(params.uploadFields)) {
      formData.append(key, value);
    }
    formData.append('file', params.file);

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
        const message = parseS3Error(xhr.responseText) ?? `Upload failed with status ${xhr.status}`;
        reject(new Error(message));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    xhr.open('POST', params.uploadUrl);
    xhr.send(formData);
  });
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
