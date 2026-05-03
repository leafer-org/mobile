import type { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { CARD_WIDTH, ROW_GAP } from '../../ui/grid';

export { CARD_WIDTH, MEDIA_HEIGHT } from '../../ui/grid';

export function ItemCardLayout({
  media,
  typeBadge,
  ageGroup,
  title,
  price,
  whenLabel,
  rating,
  address,
  owner,
  likeButton,
  onPress,
  testID,
}: {
  media: ReactNode;
  typeBadge?: ReactNode;
  ageGroup?: ReactNode;
  title: ReactNode;
  price?: ReactNode;
  whenLabel?: ReactNode;
  rating?: ReactNode;
  address?: ReactNode;
  owner?: ReactNode;
  likeButton?: ReactNode;
  onPress?: () => void;
  testID?: string;
}) {
  const hasBadges = typeBadge !== undefined || ageGroup !== undefined;
  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      onPress={onPress}
      style={{ width: CARD_WIDTH, marginBottom: ROW_GAP }}
    >
      <View>
        {media}
        {likeButton}
      </View>
      <View className="px-2 pt-2.5 gap-1.5">
        {hasBadges ? (
          <View className="flex-row flex-wrap gap-1">
            {typeBadge}
            {ageGroup}
          </View>
        ) : null}
        {title}
        {whenLabel}
        {price}
        {rating}
        {address}
        {owner}
      </View>
    </TouchableOpacity>
  );
}
