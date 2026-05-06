import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export type VideoProcessingStatus = 'pending' | 'processing' | 'ready' | 'failed';

export interface VideoPreview {
  mediaId: string;
  processingStatus: VideoProcessingStatus;
  progress: number | null;
  hlsUrl: string | null;
  mp4PreviewUrl: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
}

export function useVideoPreview(mediaId: string | undefined) {
  const fetchClient = useApiFetchClient();

  const query = useQuery({
    queryKey: ['video-preview', mediaId],
    queryFn: async (): Promise<VideoPreview> => {
      const { data, error } = await fetchClient.GET('/media/video/preview/{mediaId}', {
        params: { path: { mediaId: mediaId! } },
      });
      if (error) throw error;
      return data as VideoPreview;
    },
    enabled: Boolean(mediaId),
    refetchInterval: (q) => {
      const status = q.state.data?.processingStatus;
      if (status === 'ready' || status === 'failed') return false;
      return 1000;
    },
  });

  return {
    hlsUrl: query.data?.hlsUrl ?? null,
    mp4PreviewUrl: query.data?.mp4PreviewUrl ?? null,
    thumbnailUrl: query.data?.thumbnailUrl ?? null,
    processingStatus: query.data?.processingStatus ?? null,
    progress: query.data?.progress ?? null,
    duration: query.data?.duration ?? null,
    isPending: query.isPending && Boolean(mediaId),
    isProcessing:
      query.data?.processingStatus === 'pending' || query.data?.processingStatus === 'processing',
    isReady: query.data?.processingStatus === 'ready',
    isFailed: query.data?.processingStatus === 'failed',
  };
}
