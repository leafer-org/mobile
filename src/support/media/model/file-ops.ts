import { File } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';

export interface MultipartUploadParams {
  url: string;
  fileUri: string;
  mimeType: string;
  fields: Record<string, string>;
  fieldName?: string;
  onProgress?: (progress: number) => void;
}

export interface MultipartUploadResult {
  status: number;
  body: string;
}

export async function uploadMultipart(
  params: MultipartUploadParams,
): Promise<MultipartUploadResult> {
  const task = FileSystem.createUploadTask(
    params.url,
    params.fileUri,
    {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: params.fieldName ?? 'file',
      parameters: params.fields,
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
  return { status: response.status, body: response.body };
}

export interface FileChunkReader {
  readChunk(start: number, length: number): Promise<Uint8Array>;
  close(): void;
}

export async function openFileChunkReader(uri: string): Promise<FileChunkReader> {
  const file = new File(uri);
  return {
    async readChunk(start, length) {
      const handle = file.open();
      try {
        handle.offset = start;
        return handle.readBytes(length);
      } finally {
        handle.close();
      }
    },
    close() {},
  };
}
