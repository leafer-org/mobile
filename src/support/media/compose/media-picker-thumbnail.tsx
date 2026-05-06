import type { ResolvedMediaItem } from '../types';
import { useImagePreview } from '../model/use-image-preview';
import { useVideoPreview } from '../model/use-video-preview';
import { MediaThumbnail } from '../ui/media-thumbnail';

export function MediaPickerThumbnail({
  item,
  onRemove,
  onPress,
  disabled,
  className,
}: {
  item: ResolvedMediaItem;
  onRemove?: () => void;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const hasPreview = Boolean(item.preview);
  const isVideo = item.type === 'video';

  const imagePreview = useImagePreview({
    fileId: !hasPreview && !isVideo ? item.mediaId : undefined,
  });
  const videoPreview = useVideoPreview(!hasPreview && isVideo ? item.mediaId : undefined);

  const previewUrl =
    item.type === 'image'
      ? (item.preview?.url ?? imagePreview.previewUrl ?? null)
      : null;

  const videoData =
    item.type === 'video' && item.preview
      ? item.preview
      : {
          thumbnailUrl: videoPreview.thumbnailUrl,
          processingStatus: videoPreview.processingStatus,
          progress: videoPreview.progress,
        };

  return (
    <MediaThumbnail
      item={item}
      previewUrl={previewUrl}
      thumbnailUrl={videoData.thumbnailUrl}
      videoStatus={videoData.processingStatus}
      videoProgress={videoData.progress}
      onRemove={onRemove}
      onPress={onPress}
      disabled={disabled}
      className={className}
    />
  );
}
