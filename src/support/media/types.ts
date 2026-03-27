export type ResolvedImageMedia = {
  type: 'image';
  mediaId: string;
  preview?: { url: string };
};

export type ResolvedVideoMedia = {
  type: 'video';
  mediaId: string;
  preview?: {
    thumbnailUrl: string | null;
    hlsUrl: string | null;
    mp4PreviewUrl: string | null;
    processingStatus: 'pending' | 'processing' | 'ready' | 'failed';
    progress: number | null;
  };
};

export type ResolvedMediaItem = ResolvedImageMedia | ResolvedVideoMedia;
