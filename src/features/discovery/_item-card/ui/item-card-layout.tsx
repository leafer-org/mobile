import type { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { CARD_WIDTH, ROW_GAP } from '../../ui/grid';

export { CARD_WIDTH, MEDIA_HEIGHT } from '../../ui/grid';

export function ItemCardLayout({
  media,
  title,
  price,
  rating,
  owner,
  likeButton,
  onPress,
  testID,
}: {
  media: ReactNode;
  title: ReactNode;
  price?: ReactNode;
  rating?: ReactNode;
  owner?: ReactNode;
  likeButton?: ReactNode;
  onPress?: () => void;
  testID?: string;
}) {
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
        {owner}
        {title}
        {price}
        {rating}
      </View>
    </TouchableOpacity>
  );
}
