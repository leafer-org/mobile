import { useUploadImage } from '@/support/media';

export function useUploadAvatar() {
  return useUploadImage({
    name: 'avatar',
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
}
