import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export function useAvatarPreview({ fileId }: { fileId: string | undefined }) {
  const fetchClient = useApiFetchClient();

  const result = useQuery({
    queryKey: ['avatar-preview', fileId],
    queryFn: async ({ queryKey }) => {
      const mediaId = queryKey[1] as string;
      const response = await fetchClient.GET('/media/preview/{mediaId}', {
        params: { path: { mediaId } },
      });
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: Boolean(fileId),
  });

  if (result.isPending && fileId) {
    return { isPending: true as const };
  }

  if (result.isSuccess && result.data) {
    return { isSuccess: true as const, previewUrl: result.data.url, fileId };
  }

  if (result.isError) {
    return { isError: true as const, error: result.error };
  }

  return {};
}
