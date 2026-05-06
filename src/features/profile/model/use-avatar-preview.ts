import { useImagePreview } from '@/support/media';

export function useAvatarPreview({ fileId }: { fileId: string | undefined }) {
  return useImagePreview({ fileId, queryKeyPrefix: 'avatar-preview' });
}
