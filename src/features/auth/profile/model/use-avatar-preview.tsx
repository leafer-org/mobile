import { useQuery } from '@tanstack/react-query';

import { MediaRecord } from './use-upload-media';
import { useApiFetchClient } from '@/kernel/api/provider';

export function useAvatarPreview({ media }: { media: MediaRecord | undefined }) {
  const fetchClient = useApiFetchClient();

  const result = useQuery({
    queryKey: ['avatar-preview', media?.mediaId],
    queryFn: () =>
      media
        ? fetchClient.POST('/media/avatar/preview-upload', { body: media }).then(({ data }) => data)
        : undefined,
  });

  if (result.isPending) {
    return { isPending: true };
  }

  if (result.isSuccess) {
    return { isSuccess: true, avatar: result.data, validMedia: media };
  }

  return {
    isError: true,
    error: result.error,
  };
}
