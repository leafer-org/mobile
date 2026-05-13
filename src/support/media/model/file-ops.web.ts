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
  const blob = await fetchAsBlob(params.fileUri);

  const formData = new FormData();
  for (const [key, value] of Object.entries(params.fields)) {
    formData.append(key, value);
  }
  formData.append(params.fieldName ?? 'file', new Blob([blob], { type: params.mimeType }), 'file');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        params.onProgress?.((event.loaded / event.total) * 100);
      }
    });
    xhr.addEventListener('load', () => resolve({ status: xhr.status, body: xhr.responseText }));
    xhr.addEventListener('error', () => reject(new Error('Upload failed')));
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

    xhr.open('POST', params.url);
    xhr.send(formData);
  });
}

export interface FileChunkReader {
  readChunk(start: number, length: number): Promise<Uint8Array>;
  close(): void;
}

export async function openFileChunkReader(uri: string): Promise<FileChunkReader> {
  let blob: Blob | null = await fetchAsBlob(uri);
  return {
    async readChunk(start, length) {
      if (!blob) throw new Error('FileChunkReader is closed');
      const slice = blob.slice(start, start + length);
      const buffer = await slice.arrayBuffer();
      return new Uint8Array(buffer);
    },
    close() {
      blob = null;
    },
  };
}

async function fetchAsBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error(`Failed to read file: ${response.status}`);
  return response.blob();
}
