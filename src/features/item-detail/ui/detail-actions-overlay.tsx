import { Ionicons } from '@expo/vector-icons';
import { Share, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onBackPress: () => void;
  isLiked: boolean;
  onLikePress: () => void;
  shareTitle?: string;
  shareUrl?: string;
};

export function DetailActionsOverlay({
  onBackPress,
  isLiked,
  onLikePress,
  shareTitle,
  shareUrl,
}: Props) {
  const insets = useSafeAreaInsets();

  const handleShare = () => {
    Share.share({
      title: shareTitle,
      message: shareUrl ?? shareTitle ?? '',
    }).catch(() => {});
  };

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-10 flex-row items-center justify-between px-3"
      style={{ top: insets.top + 8 }}
    >
      <TouchableOpacity
        testID="detail-back"
        onPress={onBackPress}
        activeOpacity={0.7}
        hitSlop={6}
        className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
      >
        <Ionicons name="arrow-back" size={22} color="#ffffff" />
      </TouchableOpacity>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          testID="detail-share"
          onPress={handleShare}
          activeOpacity={0.7}
          hitSlop={6}
          className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
        >
          <Ionicons name="share-outline" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          testID="detail-like"
          onPress={onLikePress}
          activeOpacity={0.7}
          hitSlop={6}
          className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? '#f43f5e' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
