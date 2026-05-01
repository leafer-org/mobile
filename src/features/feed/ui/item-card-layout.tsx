import type { ReactNode } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';

const NUM_COLUMNS = 2;
const GRID_GAP = 8;
const HORIZONTAL_PADDING = 12;
const CARD_WIDTH =
  (Dimensions.get('window').width - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;
const MEDIA_HEIGHT = CARD_WIDTH * 1.1;

export { CARD_WIDTH, MEDIA_HEIGHT, NUM_COLUMNS, GRID_GAP, HORIZONTAL_PADDING };

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
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm"
      style={{ width: CARD_WIDTH, marginBottom: GRID_GAP }}
    >
      <View>
        {media}
        {likeButton}
      </View>
      <View className="p-2 gap-1">
        {title}
        {price}
        {rating}
        {owner}
      </View>
    </TouchableOpacity>
  );
}
